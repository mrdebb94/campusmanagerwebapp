using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using EvoManager.Models;
using EvoManager.ViewModels;
using Serilog;

namespace EvoManager.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
      private EvoDbContext _context;
	  private readonly UserManager<User> _userManager;
      private readonly SignInManager<User> _signInManager;
	  
	  public UserController(EvoDbContext context,  UserManager<User> userManager,
          SignInManager<User> signInManager) {
		  _context = context;  
		  _userManager = userManager;
          _signInManager = signInManager;
	  }
	
	  [HttpGet("[action]")]
	  public IEnumerable<User> List() {
		 
		 return _context.Users.Select(m=>new {Id, Name = UserName, Password = PasswordHash, Email = Email })ToList();
		  
	  }	
	  
	   [HttpPost("[action]")]
       /*[AllowAnonymous]*/
       [ValidateAntiForgeryToken]
	   public async Task<IActionResult> Add([FromBody][Bind("Name", "Password","Email")] UserViewModel user)
	   {

		  var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
          var result = await _userManager.CreateAsync(user, model.Password);
          if (result.Succeeded)
          {
            //await _signInManager.SignInAsync(user, isPersistent: false);
            //Lob.Information("User created a new account with password.");
            return Ok();
          }
		 
		 /*String guid = Guid.NewGuid().ToString();
		 user.UserId=guid;
		 
         Log.Information("User data: " + user.UserId + " " + user.Name + " " + user.Password + " " + user.Email);

		 _context.Users.Add(user);
	     _context.SaveChanges();*/
        
		 return Ok();	  
	  
	  }
	  
	}
}