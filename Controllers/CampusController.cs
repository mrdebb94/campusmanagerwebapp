using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EvoManager.Models;
using Serilog;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using EvoManager.ViewModels;

namespace EvoManager.Controllers
{
	[Authorize]
    [Route("api/[controller]")]
    public class CampusController : Controller
    {
      private EvoDbContext _context;

	  private readonly UserManager<User> _userManager;
      private readonly SignInManager<User> _signInManager;
	  private readonly RoleManager<IdentityRole> _roleManager;
	  
	  public CampusController(EvoDbContext context, UserManager<User> userManager,
          SignInManager<User> signInManager, RoleManager<IdentityRole> roleManager) {
		  _context = context;  
		  _userManager = userManager;
          _signInManager = signInManager;
		  _roleManager =  roleManager;

	  }
	   
	  [AllowAnonymous]
	  [HttpGet("[action]")]
	  public IEnumerable<CampusViewModel> List() {

		  /*  public DateRange CampusInactive { get; set; }
             public DateRange CampusActiveNotStarted { get; set; }
             public DateRange CampusActiveStarted { get; set; }
             public DateRange CampusFinished { get; set; } 

			 CAMPUS_ACTIVE_NOT_STARTED=1,
             CAMPUS_ACTIVE_STARTED=2,
             CAMPUS_FINISHED=3
	     */
		 
		 return _context.Campus.Include(m=>m.CampusStates).Select(m=>new CampusViewModel {
			 CampusId = m.CampusId,
			 StartDate = m.StartDate,
			 EndDate = m.EndDate,
			 Active = m.Active,
			 CampusInactive = m.CampusStates
			  .Where(s=>s.CampusStateValue==(int)CampusStateValue.CAMPUS_INACTIVE)
			  .Select(s=>new DateRange { StartDate = s.StartDate, EndDate = s.EndDate})
			  .FirstOrDefault(),
			 CampusActiveNotStarted = m.CampusStates
			  .Where(s=>s.CampusStateValue==(int)CampusStateValue.CAMPUS_ACTIVE_NOT_STARTED)
			  .Select(s=>new DateRange { StartDate = s.StartDate, EndDate = s.EndDate})
			  .FirstOrDefault(),
			 CampusActiveStarted = m.CampusStates
			  .Where(s=>s.CampusStateValue==(int)CampusStateValue.CAMPUS_ACTIVE_STARTED)
			  .Select(s=>new DateRange { StartDate = s.StartDate, EndDate = s.EndDate})
			  .FirstOrDefault(),
			CampusFinished =  m.CampusStates
			  .Where(s=>s.CampusStateValue==(int)CampusStateValue.CAMPUS_FINISHED)
			  .Select(s=>new DateRange { StartDate = s.StartDate, EndDate = s.EndDate})
			  .FirstOrDefault()
		 }).ToList();
		  
	  }	
	   
      [AllowAnonymous]
	  [HttpGet("current")]
	  public Campus GetCurrentCampus() {
		 
		 DateTime currentDate = DateTime.Now;

		 return _context.CampusState
		 .Include(m=>m.Campus)
		 .Where(m=>m.Campus.Active&&m.CampusStateValue==(int)CampusStateValue.CAMPUS_ACTIVE_NOT_STARTED&&m.StartDate<=currentDate&&
		 m.EndDate>=currentDate).Select(m=>new Campus { CampusId = m.Campus.CampusId,
			 StartDate = m.Campus.StartDate,
			 EndDate = m.Campus.EndDate}).FirstOrDefault();
;		  
	  }	

	  [AllowAnonymous]
	  [HttpGet("current/participations")]
	  public IList<CampusParticipation> GetCampusParticipationsCurrentCampus() 
	  {
		 
		 DateTime currentDate = DateTime.Now;

		 return _context.CampusParticipations
		 .Where(
			 s=>s.Campus.Active/*&&s.Campus.StartDate<=currentDate
		 &&s.Campus.EndDate>=currentDate*/)
		 .Select(s=>new CampusParticipation
		 { 
            CampusParticipationId = s.CampusParticipationId,
            Student = s.Student!=null?new Student { StudentId = s.Student.StudentId, User = new User { Name = s.Student.User.Name} }:null,
			Mentor = s.Mentor!=null?new Mentor { MentorId = s.Mentor.MentorId, User = new User { Name = s.Mentor.User.Name } }:null
		 }).ToList();
	  }	
	   [AllowAnonymous]
	   [HttpPost("[action]")]
	   public IActionResult Add([FromBody][Bind("StartDate", "EndDate","Active", "CampusInactive", 
	   "CampusActiveNotStarted", "CampusActiveStarted", "CampusFinished")] CampusViewModel campus) {
		 
         /*  public DateRange CampusInactive { get; set; }
             public DateRange CampusActiveNotStarted { get; set; }
             public DateRange CampusActiveStarted { get; set; }
             public DateRange CampusFinished { get; set; } 

			 CAMPUS_ACTIVE_NOT_STARTED=1,
             CAMPUS_ACTIVE_STARTED=2,
             CAMPUS_FINISHED=3
	     */

         //TODO: átlapolások figyelése

		 String guid = Guid.NewGuid().ToString();
		 campus.CampusId=guid;

         //egyszerre csak egy Campus lehessen aktív
         if(campus.Active) {
           foreach(var otherCampus in _context.Campus) {
			   otherCampus.Active = false;
		   }
		 }
         
		 _context.SaveChanges();

		 _context.Campus.Add(new Campus {
			  CampusId = campus.CampusId, 
			  StartDate = campus.StartDate,
		      EndDate = campus.EndDate,
			  Active = campus.Active
		  });
		 _context.SaveChanges();

         //TOO: időintervallumok ellenőrzése
         if(campus.CampusInactive!=null)
		 {

			CampusState campusState = new CampusState();
			campusState.CampusStateId = Guid.NewGuid().ToString();
			campusState.CampusId = campus.CampusId;
			Log.Information("Inaktív " + (int)CampusStateValue.CAMPUS_INACTIVE);
			Log.Information("Inaktív Start " + campus.CampusInactive.StartDate.ToString());
			Log.Information("Inaktív End " + campus.CampusInactive.EndDate.ToString());
			campusState.CampusStateValue = (int)CampusStateValue.CAMPUS_INACTIVE;
			campusState.StartDate = campus.CampusInactive.StartDate;
			campusState.EndDate = campus.CampusInactive.EndDate;
			
			_context.CampusState.Add(campusState);

		 }

		if(campus.CampusActiveNotStarted!=null)
		 {
			CampusState campusState = new CampusState();
			campusState.CampusStateId = Guid.NewGuid().ToString();
			campusState.CampusId = campus.CampusId;
			Log.Information("Aktív, de még nem indult el " + (int)CampusStateValue.CAMPUS_ACTIVE_NOT_STARTED);
			campusState.CampusStateValue = (int)CampusStateValue.CAMPUS_ACTIVE_NOT_STARTED;
			campusState.StartDate = campus.CampusActiveNotStarted.StartDate;
			campusState.EndDate = campus.CampusActiveNotStarted.EndDate;
			
			_context.CampusState.Add(campusState);

		 }

		 if(campus.CampusActiveStarted!=null)
		 {
			CampusState campusState = new CampusState();
			campusState.CampusStateId = Guid.NewGuid().ToString();
			campusState.CampusId = campus.CampusId;
			Log.Information("Elindult " + (int)CampusStateValue.CAMPUS_ACTIVE_STARTED);
			Log.Information("Elindult Start " + campus.CampusActiveStarted.StartDate.ToString());
			Log.Information("Elindult End " + campus.CampusActiveStarted.EndDate.ToString());
			campusState.CampusStateValue = (int)CampusStateValue.CAMPUS_ACTIVE_STARTED;
			campusState.StartDate = campus.CampusActiveStarted.StartDate;
			campusState.EndDate = campus.CampusActiveStarted.EndDate;
			
			_context.CampusState.Add(campusState);

		 }

		if(campus.CampusFinished!=null)
		{
			CampusState campusState = new CampusState();
			campusState.CampusStateId = Guid.NewGuid().ToString();
			campusState.CampusId = campus.CampusId;
			Log.Information("Sikeresen lezárult " + (int)CampusStateValue.CAMPUS_FINISHED);
			campusState.CampusStateValue = (int)CampusStateValue.CAMPUS_FINISHED;
			campusState.StartDate = campus.CampusFinished.StartDate;
			campusState.EndDate = campus.CampusFinished.EndDate;
			
			_context.CampusState.Add(campusState);

		 }
	
		 _context.SaveChanges();

		 return Ok();	  
	  
	  }
	   [AllowAnonymous]
	   [HttpPost("[action]")]
	   [ValidateAntiForgeryToken]
	   public IActionResult Edit([FromBody][Bind("StartDate", "EndDate","Active", "CampusInactive", 
	   "CampusActiveNotStarted", "CampusActiveStarted", "CampusFinished")] CampusViewModel campus) {
	       
		   Campus editedCampus = _context.Campus
		   .Include(m=>m.CampusStates)
		   .FirstOrDefault(m=>m.CampusId == campus.CampusId);

		   if(campus!=null) {
                  //egyszerre csak egy Campus lehessen aktív
			 if(campus.Active) {
				foreach(var otherCampus in _context.Campus) {
					otherCampus.Active = false;
				}
			}
			_context.SaveChanges();
			
              editedCampus.StartDate = campus.StartDate;
			  editedCampus.EndDate = campus.EndDate;
			  editedCampus.Active = campus.Active;

			   //TOO: időintervallumok ellenőrzése
         if(campus.CampusInactive!=null)
		 {

			CampusState campusState = editedCampus.CampusStates
			  .FirstOrDefault(m=>m.CampusStateValue==(int)CampusStateValue.CAMPUS_INACTIVE);
		
			campusState.StartDate = campus.CampusInactive.StartDate;
			campusState.EndDate = campus.CampusInactive.EndDate;
			
		 }

		if(campus.CampusActiveNotStarted!=null)
		 {
			CampusState campusState = editedCampus.CampusStates
			  .FirstOrDefault(m=>m.CampusStateValue==(int)CampusStateValue.CAMPUS_ACTIVE_NOT_STARTED);
			campusState.StartDate = campus.CampusActiveNotStarted.StartDate;
			campusState.EndDate = campus.CampusActiveNotStarted.EndDate;
		
	     }

		 if(campus.CampusActiveStarted!=null)
		 {
			CampusState campusState = editedCampus.CampusStates
			  .FirstOrDefault(m=>m.CampusStateValue==(int)CampusStateValue.CAMPUS_ACTIVE_STARTED);
		
			campusState.StartDate = campus.CampusActiveStarted.StartDate;
			campusState.EndDate = campus.CampusActiveStarted.EndDate;


		 }

		if(campus.CampusFinished!=null)
		{
			CampusState campusState = editedCampus.CampusStates
			  .FirstOrDefault(m=>m.CampusStateValue==(int)CampusStateValue.CAMPUS_FINISHED);
			campusState.CampusStateValue = (int)CampusStateValue.CAMPUS_FINISHED;
			campusState.StartDate = campus.CampusFinished.StartDate;
			campusState.EndDate = campus.CampusFinished.EndDate;

		 }
	
		 _context.SaveChanges();
			
		}

		   return Ok();
	   }
       
	   
	 /*  [Authorize(Roles = "User")]
	   [HttpPost("[action]")]
	   public IActionResult AddUserToCampus([FromBody][Bind("UserId", "CampusId","Role")] CampusApplyViewModel campus) {
		 
		 String guid = Guid.NewGuid().ToString();
		 campus.CampusId=guid;
		 
         Log.Information("Campus data: " + campus.CampusId + " " + 
         campus.StartDate.ToString() + " " + campus.EndDate.ToString() + " " + campus.Active);

		 _context.Campus.Add(campus);
	     _context.SaveChanges();

		 return Ok();	  
	  
	  } 
	
	  */
	   
       private Task<User> GetCurrentUserAsync() => _userManager.GetUserAsync(HttpContext.User);

       [Authorize(Roles = "User, Student, Mentor")]
	   [HttpPost("[action]")]
	   [ValidateAntiForgeryToken]
	   public async Task<IActionResult> Apply([FromBody][Bind("CampusId","Role")] CampusApplyViewModel campus) {

	     String guid = Guid.NewGuid().ToString();	 
	  
		 var user = await GetCurrentUserAsync(); 
         IList<String>  roles = await _userManager.GetRolesAsync(user);

		 if(!roles.Contains("Student")&&!roles.Contains("Mentor")) {
            await _userManager.AddToRoleAsync(user,"Student");
      
			  Student student = new Student();
			  student.StudentId = guid;
			  student.UserId = user.Id;
			  //student.Name = user.UserName;
			  _context.Students.Add(student);
			  _context.SaveChanges();

			  guid = Guid.NewGuid().ToString();

			  CampusParticipation campusParticipation = new CampusParticipation();
			  campusParticipation.CampusParticipationId = guid;
			  campusParticipation.CampusId = campus.CampusId;
			  campusParticipation.StudentId = student.StudentId;
 
              _context.CampusParticipations.Add(campusParticipation);
			  _context.SaveChanges();
			
		} else {
              
			  //TODO: ellenőrizni, hogy még nem jelentkezett
			  //TODO: mentor vagy tanuló?
			  Student student = _context.Students.FirstOrDefault(m=>m.UserId == campus.UserId);

			  guid = Guid.NewGuid().ToString();

			  CampusParticipation campusParticipation = new CampusParticipation();
			  campusParticipation.CampusParticipationId = guid;
			  campusParticipation.CampusId = campus.CampusId;
			  campusParticipation.StudentId = student.StudentId;
 
              _context.CampusParticipations.Add(campusParticipation);
			  _context.SaveChanges();

		}
       
         /*ez azért kell, mert változik a bejelentkezett felhasználó
		  szerepköre (tanulóra), és emiatt a sütiket is frissíteni kell, hogy
		  a tanuló szerepkörű url-ket elérje*/
		 await _signInManager.RefreshSignInAsync(user);

		 return Ok(Json("Sikeres jelentkezés!"));	  
	  
	  } 
	  
	   [Authorize(Roles = "Admin")]
	   [HttpPost("[action]")]
	   [ValidateAntiForgeryToken]
	   public async Task<IActionResult> ChangeCampusParticipation(
		   [FromBody][Bind("CampusParticipationId", "Role")] CampusParticipationViewModel campusParticipation) {
        
		//var user = await GetCurrentUserAsync(); 
        //IList<String>  roles = await _userManager.GetRolesAsync(user);
    
	    var editedCampusParticipation = _context.CampusParticipations
			   .Include(m=>m.Student)
			   .Include(m=>m.Mentor)
               .FirstOrDefault(m=>m.CampusParticipationId == campusParticipation.CampusParticipationId );
		
		//from Student To Mentor
		if(editedCampusParticipation!=null) {
			Log.Information("Tanulo");
            if(editedCampusParticipation.StudentId!=null&&campusParticipation.Role=="Mentor") 
			{
				Log.Information("Tanulobol Mentor");

				//Set inactive student
				editedCampusParticipation.Student.IsDeleted = true;
				_context.SaveChanges(); 

				//add mentor
                 String guid = Guid.NewGuid().ToString();
				 Mentor mentor = new Mentor();
			     mentor.MentorId = guid;
			     mentor.UserId = editedCampusParticipation.Student.UserId;
			     //mentor.Name = editedCampusParticipation.Student.Name;
			     _context.Mentors.Add(mentor);
			     _context.SaveChanges();

				 editedCampusParticipation.StudentId = null;
                 editedCampusParticipation.MentorId =  mentor.MentorId;

                _context.SaveChanges();

                var user = _context.Users.FirstOrDefault(m=>m.Id == mentor.UserId);
				await _userManager.RemoveFromRoleAsync(user, "Student");
				await _userManager.AddToRoleAsync(user,"Mentor");

			} else if(editedCampusParticipation.MentorId!=null&&campusParticipation.Role=="Student") {
               
			    //Set inactive mentor
				editedCampusParticipation.Mentor.IsDeleted = true;
				_context.SaveChanges(); 

				//add student
                 String guid = Guid.NewGuid().ToString();
				 Student student = new Student();
			     student.StudentId = guid;
			     student.UserId = editedCampusParticipation.Mentor.UserId;
			     //student.Name = editedCampusParticipation.Mentor.Name;
			     _context.Students.Add(student);
			     _context.SaveChanges();

				 editedCampusParticipation.MentorId = null;
                 editedCampusParticipation.StudentId = student.StudentId;

                _context.SaveChanges();

                var user = _context.Users.FirstOrDefault(m=>m.Id == student.UserId);
				await _userManager.RemoveFromRoleAsync(user, "Mentor");
				await _userManager.AddToRoleAsync(user,"Student");

			}
		}

        
		return Ok();
	   
	   }

	}
}