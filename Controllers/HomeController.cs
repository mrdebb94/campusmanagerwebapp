using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

using Serilog;

namespace EvoManager.Controllers
{
    public class HomeController : Controller
    {
        private readonly IAntiforgery _antiForgeryService;
        private readonly RoleManager<IdentityRole> _roleManager;
 
        public HomeController(IAntiforgery antiForgeryService, RoleManager<IdentityRole> roleManager)
        {
            _antiForgeryService = antiForgeryService;
            _roleManager =  roleManager;
        }
    
        public async Task<IActionResult> Index()
        {
            /*var token = _antiForgeryService.GetAndStoreTokens(HttpContext).RequestToken;
            HttpContext.Response.Cookies.Append("XSRF-TOKEN", token, new CookieOptions { HttpOnly = false });*/

            //var tokens =  _antiForgeryService.GetAndStoreTokens(this.HttpContext);
            //HttpContext.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, new CookieOptions { HttpOnly = false });
            // Render this token in a div, so our javascript can read it and send it, and send it in the ajax request header where it can be validated against the XSRF-TOKEN cookie
           
            //Log.Information("Token by first loading: " +  tokens.RequestToken);
            //this.ViewBag.AntiForgeryRequestToken = tokens.RequestToken;

            //TODO:máshová kellene
            bool existsRole = await _roleManager.RoleExistsAsync("User");

			if(!existsRole)
			{
				var role = new IdentityRole();
                role.Name = "User";
                await _roleManager.CreateAsync(role);
				
			}

            existsRole = await _roleManager.RoleExistsAsync("Admin");

			if(!existsRole)
			{
				var role = new IdentityRole();
                role.Name = "Admin";
                await _roleManager.CreateAsync(role);
				
			}

            existsRole = await _roleManager.RoleExistsAsync("Mentor");

			if(!existsRole)
			{
				var role = new IdentityRole();
                role.Name = "Mentor";
                await _roleManager.CreateAsync(role);
				
			}

            existsRole = await _roleManager.RoleExistsAsync("Student");

			if(!existsRole)
			{
				var role = new IdentityRole();
                role.Name = "Student";
                await _roleManager.CreateAsync(role);
		
			}

            this.ViewBag.IsAuthenticated = this.User.Identity.IsAuthenticated;

            return View();
        }
    }
}
