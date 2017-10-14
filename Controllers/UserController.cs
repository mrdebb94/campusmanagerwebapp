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

namespace EvoManager.Controllers
{
	[Authorize]
    [Route("api/[controller]")]
    public class UserController : Controller
    {

      private EvoDbContext _context;
	  private readonly UserManager<User> _userManager;
      private readonly SignInManager<User> _signInManager;
	  private readonly RoleManager<IdentityRole> _roleManager;
	  private readonly IAntiforgery _antiForgeryService;
	  private readonly IUserClaimsPrincipalFactory<User> _userClaimsPrincipalFactory;
	  
	  public UserController(EvoDbContext context,  UserManager<User> userManager,
          SignInManager<User> signInManager, RoleManager<IdentityRole> roleManager,
		  IAntiforgery antiForgeryService,  IUserClaimsPrincipalFactory<User> userClaimsPrincipalFactory) {
		  _context = context;  
		  _userManager = userManager;
          _signInManager = signInManager;
		  _roleManager =  roleManager;
		  _antiForgeryService = antiForgeryService;
		  _userClaimsPrincipalFactory =  userClaimsPrincipalFactory;

	  }
	  
	  [AllowAnonymous]
	  [HttpGet("[action]")]
	  public async Task<IEnumerable<UserViewModel>> List() {
		 
       Log.Information("Supporting role " +  _userManager.SupportsUserRole);
       
	   List<UserViewModel> resultUsers = new List<UserViewModel>();
    
	   foreach(var user in _context.Users) {
		   IList<String>  roles = await _userManager.GetRolesAsync(user);

		   resultUsers.Add( new UserViewModel {
			UserId = user.Id, 
	     	Name = user.UserName, 
	   		Password = user.PasswordHash, 
	   		Email = user.Email,
			Type = (roles.Count>0?roles[0]:"")
	   		});
	   }

	   /*var tokens =  _antiForgeryService.GetAndStoreTokens(this.HttpContext);
       this.HttpContext.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, 
                        new CookieOptions() { HttpOnly = false });
       Log.Information("New Token " + tokens.RequestToken);*/
        
	  return resultUsers;

	  }	
	   
	   [AllowAnonymous]
       [HttpPost("[action]")]
       [ValidateAntiForgeryToken]
	   public async Task<IActionResult> LogIn([FromBody][Bind("Name", "Password")] UserViewModel userModel)
	   {
			var result = await _signInManager.PasswordSignInAsync(userModel.Name, 
			userModel.Password, false, lockoutOnFailure: false);
			if (result.Succeeded)
			{
				//var user =  _context.Users.FirstOrDefault(m=>m.UserName == userModel.Name);
                //HttpContext.User = await _userClaimsPrincipalFactory.CreateAsync(user);
				//var tokens =  _antiForgeryService.GetAndStoreTokens(this.HttpContext);
				Log.Information("Belepes: " + this.User.Identity.IsAuthenticated);
				//Log.Information("Token by login: " +  tokens.RequestToken);
				//var tokens =  _antiForgeryService.GetAndStoreTokens(this.HttpContext);
				/*var tokens =_antiForgeryService.GetAndStoreTokens(this.HttpContext);
                this.HttpContext.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, 
                        new CookieOptions() { HttpOnly = false });
                Log.Information("New Token LOGIN" + tokens.RequestToken);
				*/
				return Ok(Json("Sikeres belepes"));
			} else {
				return NotFound();
			}
	    }
      
	   
       [AllowAnonymous]
	   [HttpPost("[action]")]
       [ValidateAntiForgeryToken]
	   public async Task<IActionResult> Add([FromBody][Bind("Name", "Password","Email", "Type")] UserViewModel userModel)
	   {

		  User user = new User { UserName =userModel.Name, Email = userModel.Email };
          var result = await _userManager.CreateAsync(user, userModel.Password);
          if (result.Succeeded)
          {
			bool existsRole = await _roleManager.RoleExistsAsync(userModel.Type);

			if(!existsRole)
			{
				var role = new IdentityRole();
                role.Name = userModel.Type;
                await _roleManager.CreateAsync(role);
				//TODO szereptől függő plusz adat??
			}

			await _userManager.AddToRoleAsync(user,userModel.Type);
            //await _signInManager.SignInAsync(user, isPersistent: false);
            //Lob.Information("User created a new account with password.");
            return Ok(Json("Successfully"));
          }
		     
		 return Ok();	  
	  
	  }
	  
	  [HttpPost("[action]")]
      [ValidateAntiForgeryToken]
      public async Task<IActionResult> LogOut()
      {
         await _signInManager.SignOutAsync();
		 //var tokens =  _antiForgeryService.GetAndStoreTokens(this.HttpContext);
         Log.Information("Kilepes: " + this.User.Identity.IsAuthenticated);
		 /*var tokens =_antiForgeryService.GetAndStoreTokens(this.HttpContext);
                this.HttpContext.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, 
                        new CookieOptions() { HttpOnly = false });

                Log.Information("New Token LOGOUT" + tokens.RequestToken);*/
         return Ok();
      }
	}
}