using System;
using System.Collections.Generic;
using System.Linq;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Security.Claims;
using EvoManager.Models;
using EvoManager.ViewModels;
using Serilog;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.EntityFrameworkCore;

namespace EvoManager.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class ProjectController : Controller
    {

      private EvoDbContext _context;
	  private readonly UserManager<User> _userManager;
	  private readonly RoleManager<IdentityRole> _roleManager;
  
	  public ProjectController(EvoDbContext context,  UserManager<User> userManager,
          RoleManager<IdentityRole> roleManager,
		  IAntiforgery antiForgeryService) {
		  _context = context;  
		  _userManager = userManager;
		  _roleManager =  roleManager;
	  }

      [Authorize(Roles = "Admin, Mentor")]
      [HttpGet("current/list")]
      public IList<ProjectViewModel> ListProjectsInCurrentCampus() {
         DateTime currentDate = DateTime.Now;

         return _context.ProjectCampus
         .Where(m=>m.Campus.Active/*&&m=>m.Campus.StartDate<=currentDate
		 &&m.Campus.EndDate>=currentDate*/)
         .Select(m=>new ProjectViewModel {
             ProjectCampusId = m.ProjectCampusId,
             Name = m.Project.Name,
             ProjectStatus = new ProjectStatus {
                 Value = m.ProjectStatus.Value
             },
             Campus = new Campus {
                 StartDate = m.Campus.StartDate,
                 EndDate = m.Campus.EndDate
             }
         })
         .ToList(); 
      }
      
       /// <summary>Folytathat projektek listázása: olyan projektek,amelyekett
       /// korábbi campus félévben csináltak, és idei (aktív) campushoz
       //  nincsenek hozzárendelve, vagy csak ötlet jelleggel voltak felvéve,
       //  és még egyáltalán nincs hozzárendelve
       /// </summary>
      [Authorize(Roles = "Admin, Mentor")]
      [HttpGet("continuable/list")]
      public IList<ProjectViewModel> ListContinuableProjects() {
         DateTime currentDate = DateTime.Now;

         /*return _context.ProjectCampus
         .Where(m=>m.Campus.Active)
         .Select(m=>new ProjectViewModel {
             ProjectCampusId = m.ProjectCampusId,
             Name = m.Project.Name,
             ProjectStatus = new ProjectStatus {
                 Value = m.ProjectStatus.Value
             },
             Campus = new Campus {
                 StartDate = m.Campus.StartDate,
                 EndDate = m.Campus.EndDate
             }
         })
         .ToList();*/

         return _context.Projects
         .Include(m=>m.ProjectCampus)
         .Where(m=>m.ProjectCampus.Count()==0 || m.ProjectCampus.Count(s=>s.Campus.Active==true)==0)
         .Select(m=>new ProjectViewModel {
             ProjectId = m.ProjectId,
             Name = m.Name,
             Description = m.Description
         })
        .ToList();
         
      }

      [Authorize(Roles = "Admin")]
      [HttpPost("[action]")]
      public IActionResult Add(
          [FromBody][Bind("ProjectId","Name","Description","ProjectStatus", "Campus")] ProjectViewModel project) {
         
         
        ProjectStatus projectStatus = _context.ProjectStatus
        .FirstOrDefault(m=>m.Value==project.ProjectStatus.Value);

        if(projectStatus==null) {
             projectStatus = new ProjectStatus {
                Value = project.ProjectStatus.Value
             };
            _context.ProjectStatus.Add(projectStatus);
            _context.SaveChanges();
        }
        
        Project newProject = null;

        //meglévő projektet folytatunk
        if(project.ProjectId==null) {
            
            newProject = new Project {
               Name = project.Name,
               Description = project.Description,
            //CampusId = project.Campus.CampusId,
            //ProjectStatusId = projectStatus.ProjectStatusId
            };

         _context.Projects.Add(newProject);
         _context.SaveChanges();

        }

        else {
        
            newProject = _context.Projects.FirstOrDefault(m=>m.ProjectId == project.ProjectId);
            //TODO: ellenőrzés, hogy van-e ilyen
        }

        ProjectCampus projectCampus = new ProjectCampus {
            ProjectId = newProject.ProjectId,
            CampusId =  project.Campus.CampusId,
            ProjectStatusId = projectStatus.ProjectStatusId
        };

         _context.ProjectCampus.Add(projectCampus);
         _context.SaveChanges();
         
        return Ok();

      }

    }

}