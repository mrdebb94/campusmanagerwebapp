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
using Microsoft.EntityFrameworkCore;

using Serilog;

namespace EvoManager.Controllers
{
    [Authorize]
	[Route("api/[controller]")]
    public class ReportController : Controller
    {
		private EvoDbContext _context;
        private readonly IAntiforgery _antiForgeryService;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
 
        public ReportController(EvoDbContext context, IAntiforgery antiForgeryService,
         UserManager<User> userManager,
         RoleManager<IdentityRole> roleManager)
        {
			_context = context;
            _antiForgeryService = antiForgeryService;
            _userManager = userManager;
            _roleManager =  roleManager;
        }
    
        [AllowAnonymous]
		[HttpGet("[action]")]
        public  IActionResult Campus()
        {
            
			
			
			//await _context.ReportResult.FromSql("EXECUTE xmlForReports").FirstOrDefaultAsync();
            var studentId = "e1900e2e-1a87-4ca8-a7af-234ed808f4f8";
			
			var report = _context.ReportResults
			.FromSql($"EXECUTE StudentReport {studentId}")
			.FirstOrDefault();

            return Ok(report!=null?Json(report.Xml):Json("egy"));
        }
    }
}
