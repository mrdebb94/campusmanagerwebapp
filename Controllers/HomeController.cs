using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Http;
using EvoManager.Models;

using Serilog;

namespace EvoManager.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly IAntiforgery _antiForgeryService;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public HomeController(IAntiforgery antiForgeryService,
         UserManager<User> userManager,
         RoleManager<IdentityRole> roleManager)
        {
            _antiForgeryService = antiForgeryService;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [AllowAnonymous]
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

            if (!existsRole)
            {
                var role = new IdentityRole();
                role.Name = "User";
                await _roleManager.CreateAsync(role);

            }

            existsRole = await _roleManager.RoleExistsAsync("Admin");

            if (!existsRole)
            {
                var role = new IdentityRole();
                role.Name = "Admin";
                await _roleManager.CreateAsync(role);

            }

            existsRole = await _roleManager.RoleExistsAsync("Mentor");

            if (!existsRole)
            {
                var role = new IdentityRole();
                role.Name = "Mentor";
                await _roleManager.CreateAsync(role);

            }

            existsRole = await _roleManager.RoleExistsAsync("Student");

            if (!existsRole)
            {
                var role = new IdentityRole();
                role.Name = "Student";
                await _roleManager.CreateAsync(role);

            }

            var user = await _userManager.GetUserAsync(HttpContext.User);

            if (user != null)
            {
                IList<String> roles = await _userManager.GetRolesAsync(user);
                this.ViewBag.Roles = roles;
                this.ViewBag.Id = user.Id;
            }
            else
            {
                this.ViewBag.Roles = new List<String>();
                this.ViewBag.Id = null;
            }

            this.ViewBag.IsAuthenticated = this.User.Identity.IsAuthenticated;


            return View();
        }
    }
}
