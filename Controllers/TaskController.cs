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
    public class TaskController : Controller
    {
       private EvoDbContext _context;
	   private readonly UserManager<User> _userManager;
	   private readonly RoleManager<IdentityRole> _roleManager;
  
	   public TaskController(EvoDbContext context,  UserManager<User> userManager,
          RoleManager<IdentityRole> roleManager,
		  IAntiforgery antiForgeryService)
        {
		  _context = context;  
		  _userManager = userManager;
		  _roleManager =  roleManager;
	    }
		
	  [Authorize(Roles = "Mentor")]
      [HttpPost("current/add")]
      [ValidateAntiForgeryToken]
      public async Task<ActionResult> AddTaskToCurrentProject([FromBody] 
       EvoManager.Models.Task task) 
      {
		  
		  return Ok();
	  }
		
	}
}