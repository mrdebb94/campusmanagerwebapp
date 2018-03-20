using System;
using System.IO;
using System.Xml.XPath;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
//using Microsoft.AspNetCore.Mvc.ControllerBase;
using Microsoft.AspNetCore.NodeServices;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Http;
using EvoManager.Models;
using EvoManager.ViewModels;
using Microsoft.EntityFrameworkCore;


using System.Xml;
using System.Xml.Xsl;

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
		private ICompositeViewEngine _viewEngine;
 
        public ReportController(EvoDbContext context, IAntiforgery antiForgeryService,
         UserManager<User> userManager,
         RoleManager<IdentityRole> roleManager,
		 ICompositeViewEngine viewEngine)
        {
			_context = context;
            _antiForgeryService = antiForgeryService;
            _userManager = userManager;
            _roleManager =  roleManager;
			_viewEngine = viewEngine;
        }
		
		private async Task<string> RenderPartialViewToString(string viewName, object model)
		{
			if (string.IsNullOrEmpty(viewName))
				viewName = ControllerContext.ActionDescriptor.ActionName;

			ViewData.Model = model;

			using (var writer = new StringWriter())
			{
				ViewEngineResult viewResult = 
					_viewEngine.FindView(ControllerContext, viewName, false);

				ViewContext viewContext = new ViewContext(
					ControllerContext, 
					viewResult.View, 
					ViewData, 
					TempData, 
					writer, 
					new HtmlHelperOptions()
				);

				await viewResult.View.RenderAsync(viewContext);

				return writer.GetStringBuilder().ToString();
			}
		}
    
        [AllowAnonymous]
		[HttpGet("user")]
        public async Task<IActionResult> ReportUser([FromServices] INodeServices nodeServices, string userId)
        {
			
            var student = _context.Students
			               .Where(t=>t.UserId == userId)
						   .Select(t=>new Student {
								StudentId = t.StudentId,
								User = new User { Name=t.User.Name, PhoneNumber = t.User.PhoneNumber },
								HasScholarship = t.HasScholarship
						   })
						   .First();
			
		    
			var projectCampus = _context.TeamMembers
			        .Include(t=>t.TeamMemberParticipationMeetings)
					.Include(t=>t.TeamMemberRatings)
			        .Where(t=>t.Student.UserId == userId)
					.Select(t=>new ProjectCampus { 
						Campus = new Campus {
						   StartDate = t.ProjectCampus.Campus.StartDate,
						   EndDate = t.ProjectCampus.Campus.EndDate
						},
                        Project = new Project {
                           Name = t.ProjectCampus.Project.Name,
						   Description = t.ProjectCampus.Project.Description
                        },
						ProjectMeetings = t.TeamMemberParticipationMeetings
										   .Select(p=>new ProjectMeeting {
											   StartTime = p.ProjectMeeting.StartTime,
											   EndTime = p.ProjectMeeting.EndTime,
											   TeamMemberParticipationMeetings =
											    new List<TeamMemberParticipationMeeting> {
													new TeamMemberParticipationMeeting {
														Checked = p.Checked
													}
												}
											})
                                            .ToList()
					}).ToList();
			
			
			var model = new StudentReportViewModel {
				  Student = student,
				  ProjectCampus = projectCampus  
			};  
			
			var renderedView = await RenderPartialViewToString("StudentReport", model);
			
			var result = await nodeServices.InvokeAsync<byte[]>("./pdf", renderedView); 
 
            /*HttpContext.Response.ContentType = "application/pdf"; 
             
            HttpContext.Response.Headers.Add("x-filename", "report.pdf"); 
            HttpContext.Response.Headers.Add("Access-Control-Expose-Headers", "x-filename"); 
            HttpContext.Response.Body.Write(result, 0, result.Length); 
            
			return new ContentResult();*/
            return File(result, "application/pdf", "report.pdf"); 
            //return Ok(report!=null?Json(xmloutput):Json("egy"));
        }
    }
}