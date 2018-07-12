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

        public ProjectController(EvoDbContext context, UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager,
            IAntiforgery antiForgeryService)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [Authorize(Roles = "Admin, Mentor, Student")]
        [HttpGet("current/active/list")]
        public async Task<IList<ProjectViewModel>> ListActiveProjectsInCurrentCampus()
        {

            var user = await _userManager.GetUserAsync(HttpContext.User);
            IList<String> roles = await _userManager.GetRolesAsync(user);

            CampusParticipation campusParticipation = null;

            if (!roles.Contains("Admin"))
            {
                //Be van-e iratkozva a félévre
                campusParticipation = _context.CampusParticipations
                .Include(m => m.Student)
                .Include(m => m.Mentor)
                .Where(m => m.Campus.Active &&
                          ((roles.Contains("Student") && m.StudentId != null && m.Student.UserId == user.Id) ||
                            (roles.Contains("Mentor") && m.MentorId != null && m.Mentor.UserId == user.Id))
                ).FirstOrDefault();
            }

            return _context.ProjectCampus
           .Include(m => m.SubscribedStudents)
           .Where(m => m.Campus.Active &&
                  m.ProjectStatus.Value == "Active")
           .Select(m => new ProjectViewModel
           {
               ProjectCampusId = m.ProjectCampusId,
               Name = m.Project.Name,
               Description = m.Project.Description,
               ProjectStatus = new ProjectStatus
               {
                   Value = m.ProjectStatus.Value
               },
               Campus = new Campus
               {
                   StartDate = m.Campus.StartDate,
                   EndDate = m.Campus.EndDate
               },
               SubscribedStudents = m.SubscribedStudents
               .Where(s => s.Deleted == false)
               .Select(
                   s => new SubscribedStudentViewModel
                   {
                       Student = new Student
                       {
                           StudentId = s.Student.StudentId,
                           User = new User { Name = s.Student.User.Name }
                       }
                   }
               ).ToList(),
               SubscribedMentors = m.SubscribedMentors
               .Where(s => s.Deleted == false)
               .Select(
                   s => new SubscribedMentorViewModel
                   {
                       Mentor = new Mentor
                       {
                           MentorId = s.Mentor.MentorId,
                           User = new User { Name = s.Mentor.User.Name }
                       }
                   }
               ).ToList(),
               Subscribed = ((campusParticipation != null && campusParticipation.StudentId != null
                          && m.SubscribedStudents
                          .Count(s => s.ProjectCampusId == m.ProjectCampusId
                          && s.StudentId == campusParticipation.StudentId
                          && s.Deleted == false) != 0)
                          || (campusParticipation != null && campusParticipation.MentorId != null
                          && m.SubscribedMentors
                          .Count(s => s.ProjectCampusId == m.ProjectCampusId
                          && s.MentorId == campusParticipation.MentorId
                          && s.Deleted == false) != 0))
           })
           .ToList();
        }

        [Authorize(Roles = "Mentor, Student")]
        [HttpPost("unsubscribe")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> UnSubscribeProject(
            [FromBody][Bind("ProjectCampusId")] ProjectViewModel project)
        {
            String returnMessage = "";
            DateTime currentDate = DateTime.Now;

            var user = await _userManager.GetUserAsync(HttpContext.User);
            IList<String> roles = await _userManager.GetRolesAsync(user);

            //Be van-e iratkozva a félévre
            var campusParticipation = _context.CampusParticipations
            .Include(m => m.Student)
            .Include(m => m.Mentor)
            .Where(m => m.Campus.Active &&
                      ((roles.Contains("Student") && m.StudentId != null && m.Student.UserId == user.Id) ||
                        (roles.Contains("Mentor") && m.MentorId != null && m.Mentor.UserId == user.Id))

            ).FirstOrDefault();

            if (campusParticipation != null)
            {
                //Létezik-e ilyen azonosítójú, 
                var projectCampus = _context.ProjectCampus
                   .FirstOrDefault(m => m.ProjectCampusId == project.ProjectCampusId &&
                   m.ProjectStatus.Value == "Active");
                //TODO: jelentkezési időszak !!!!

                //ha létező projektre jelentkeztünk, és a projekt aktív félévben van
                //TODO: és aktív státuszú
                if (projectCampus != null)
                {
                    if (campusParticipation.StudentId != null)
                    {
                        var subscribedStudent = _context.SubscribedStudents
                        .FirstOrDefault(m => m.ProjectCampusId == project.ProjectCampusId
                        && m.StudentId == campusParticipation.StudentId
                        && m.Deleted == false);

                        if (subscribedStudent != null)
                        {
                            subscribedStudent.Deleted = true;
                            _context.SaveChanges();
                        }
                        else
                        {
                            returnMessage = "Érvénytelen leiratkozás!";
                        }

                    }
                    else if (campusParticipation.MentorId != null)
                    {
                        var subscribedMentor = _context.SubscribedMentors
                        .FirstOrDefault(m => m.ProjectCampusId == project.ProjectCampusId
                        && m.MentorId == campusParticipation.MentorId
                        && m.Deleted == false);
                        if (subscribedMentor != null)
                        {
                            subscribedMentor.Deleted = true;
                            _context.SaveChanges();
                        }
                        else
                        {
                            returnMessage = "Érvénytelen leiratkozás!";
                        }
                    }

                }
                else
                {
                    //return Ok(Json("Nem lehet erre a projektre jelentkezni!"));	
                    returnMessage = "Nem lehet erre a projektre jelentkezni!";
                }


            }
            else
            {
                //return Ok(Json("Nincs beiratkozva a félévre!"));	
                returnMessage = "Nincs beiratkozva a félévre!";
            }

            return Ok(Json(returnMessage));
        }

        [Authorize(Roles = "Mentor, Admin")]
        [HttpPost("subscribes/mentor/modify")]
        [ValidateAntiForgeryToken]
        public ActionResult ModifyMentorProjectSubscribing(
            [FromBody][Bind("ProjectCampusId", "SubscribedMentorId")] SubscribedMentorViewModel subscribedMentor)
        {
            var currentDate = DateTime.Now;
            var existingSubscribedMentor = _context.SubscribedMentors
                          .FirstOrDefault(m => m.SubscribedMentorId == subscribedMentor.SubscribedMentorId);
            if (existingSubscribedMentor != null)
            {
                existingSubscribedMentor.Deleted = true;
                SubscribedMentor modifiedSubscribedMentor = new SubscribedMentor();
                modifiedSubscribedMentor.MentorId = existingSubscribedMentor.MentorId;
                //új projektre feliratkozás
                modifiedSubscribedMentor.ProjectCampusId = subscribedMentor.ProjectCampusId;
                modifiedSubscribedMentor.SubscribedDate = currentDate;
                _context.SubscribedMentors.Add(modifiedSubscribedMentor);
                _context.SaveChanges();

            }
            return Ok();
        }

        [Authorize(Roles = "Mentor, Admin")]
        [HttpPost("subscribes/student/modify")]
        [ValidateAntiForgeryToken]
        public ActionResult ModifyStudentProjectSubscribing(
            [FromBody][Bind("ProjectCampusId", "SubscribedStudentId")] SubscribedStudentViewModel subscribedStudent)
        {
            var currentDate = DateTime.Now;
            var existingSubscribedStudent = _context.SubscribedStudents
                          .FirstOrDefault(m => m.SubscribedStudentId == subscribedStudent.SubscribedStudentId);
            if (existingSubscribedStudent != null)
            {
                existingSubscribedStudent.Deleted = true;
                SubscribedStudent modifiedSubscribedStudent = new SubscribedStudent();
                modifiedSubscribedStudent.StudentId = existingSubscribedStudent.StudentId;
                modifiedSubscribedStudent.ProjectCampusId = subscribedStudent.ProjectCampusId;
                modifiedSubscribedStudent.SubscribedDate = currentDate;
                _context.SubscribedStudents.Add(modifiedSubscribedStudent);
                _context.SaveChanges();

            }
            return Ok();
        }

        [Authorize(Roles = "Mentor, Student")]
        [HttpPost("subscribe")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SubscribeProject(
            [FromBody][Bind("ProjectCampusId")] ProjectViewModel project)
        {
            String returnMessage = "";
            DateTime currentDate = DateTime.Now;

            var user = await _userManager.GetUserAsync(HttpContext.User);
            IList<String> roles = await _userManager.GetRolesAsync(user);

            //Be van-e iratkozva a félévre
            var campusParticipation = _context.CampusParticipations
            .Include(m => m.Student)
            .Include(m => m.Mentor)
            .Where(m => m.Campus.Active &&
                      ((roles.Contains("Student") && m.StudentId != null && m.Student.UserId == user.Id) ||
                        (roles.Contains("Mentor") && m.MentorId != null && m.Mentor.UserId == user.Id))

            ).FirstOrDefault();

            if (campusParticipation != null)
            {
                //Létezik-e ilyen azonosítójú, 
                var projectCampus = _context.ProjectCampus
                   .FirstOrDefault(m => m.ProjectCampusId == project.ProjectCampusId &&
                   m.ProjectStatus.Value == "Active");
                //TODO: jelentkezési időszak !!!!

                //ha létező projektre jelentkeztünk, és a projekt aktív félévben van
                //TODO: és aktív státuszú
                if (projectCampus != null)
                {
                    if (campusParticipation.StudentId != null)
                    {
                        //jelentkezetett-e már erre az aktív félévbe projektre
                        /*var existingSubscribedStudent =_context.SubscribedStudents
                        .FirstOrDefault(m=>m.ProjectCampusId == project.ProjectCampusId &&
                        m.StudentId == campusParticipation.StudentId);*/

                        var existingSubscribedStudent = _context.SubscribedStudents
                        .FirstOrDefault(m => m.ProjectCampus.Campus.Active &&
                        m.StudentId == campusParticipation.StudentId &&
                        m.Deleted == false);

                        if (existingSubscribedStudent == null)
                        {
                            SubscribedStudent subscribedStudent = new SubscribedStudent();
                            subscribedStudent.StudentId = campusParticipation.StudentId;
                            subscribedStudent.ProjectCampusId = projectCampus.ProjectCampusId;
                            subscribedStudent.SubscribedDate = currentDate;
                            _context.SubscribedStudents.Add(subscribedStudent);
                            _context.SaveChanges();

                            //return Ok(Json("Sikeres jelentkezés!"));
                            returnMessage = "Sikeres jelentkezés!";
                        }
                        else
                        {
                            //return Ok(Json("Már jelentkezett erre a projektre!"));
                            returnMessage = "Már jelentkezett egy projektre!";
                        }

                    }
                    else if (campusParticipation.MentorId != null)
                    {
                        //jelentkezetett-e már erre a projektre
                        /*var existingSubscribedMentor =_context.SubscribedMentors
                        .FirstOrDefault(m=>m.ProjectCampusId == project.ProjectCampusId &&
                        m.MentorId == campusParticipation.MentorId);*/

                        var existingSubscribedMentor = _context.SubscribedMentors
                        .FirstOrDefault(m => m.ProjectCampus.Campus.Active
                        && m.MentorId == campusParticipation.MentorId
                        && m.Deleted == false);

                        if (existingSubscribedMentor == null)
                        {
                            SubscribedMentor subscribedMentor = new SubscribedMentor();
                            subscribedMentor.MentorId = campusParticipation.MentorId;
                            subscribedMentor.ProjectCampusId = projectCampus.ProjectCampusId;
                            subscribedMentor.SubscribedDate = currentDate;
                            _context.SubscribedMentors.Add(subscribedMentor);
                            _context.SaveChanges();

                            //return Ok(Json("Sikeres jelentkezés!"));
                            returnMessage = "Sikeres jelentkezés!";
                        }
                        else
                        {
                            //return Ok(Json("Már jelentkezett erre a projektre!"));
                            returnMessage = "Már jelentkezett egy";
                        }

                    }
                }
                else
                {
                    //return Ok(Json("Nem lehet erre a projektre jelentkezni!"));	
                    returnMessage = "Nem lehet erre a projektre jelentkezni!";
                }

            }
            else
            {
                //return Ok(Json("Nincs beiratkozva a félévre!"));	
                returnMessage = "Nincs beiratkozva a félévre!";
            }

            return Ok(Json(returnMessage));

        }

        [Authorize(Roles = "Admin, Mentor")]
        [HttpGet("current/list")]
        public IList<ProjectViewModel> ListProjectsInCurrentCampus()
        {
            DateTime currentDate = DateTime.Now;

            return _context.ProjectCampus
            .Where(m => m.Campus.Active/*&&m=>m.Campus.StartDate<=currentDate
		 &&m.Campus.EndDate>=currentDate*/)
            .Select(m => new ProjectViewModel
            {
                ProjectCampusId = m.ProjectCampusId,
                Name = m.Project.Name,
                ProjectStatus = new ProjectStatus
                {
                    Value = m.ProjectStatus.Value
                },
                Campus = new Campus
                {
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
        public IList<ProjectViewModel> ListContinuableProjects()
        {
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
            .Include(m => m.ProjectCampus)
            .Where(m => m.ProjectCampus.Count() == 0 || m.ProjectCampus.Count(s => s.Campus.Active == true) == 0)
            .Select(m => new ProjectViewModel
            {
                ProjectId = m.ProjectId,
                Name = m.Name,
                Description = m.Description
            })
           .ToList();

        }

        [Authorize(Roles = "Admin")]
        [HttpPost("[action]")]
        [ValidateAntiForgeryToken]
        public IActionResult Add(
            [FromBody][Bind("ProjectId", "Name", "Description", "ProjectStatus", "Campus")] ProjectViewModel project)
        {


            ProjectStatus projectStatus = _context.ProjectStatus
            .FirstOrDefault(m => m.Value == project.ProjectStatus.Value);

            if (projectStatus == null)
            {
                projectStatus = new ProjectStatus
                {
                    Value = project.ProjectStatus.Value
                };
                _context.ProjectStatus.Add(projectStatus);
                _context.SaveChanges();
            }

            Project newProject = null;

            //meglévő projektet folytatunk
            if (project.ProjectId == null || project.ProjectId == "")
            {

                newProject = new Project
                {
                    Name = project.Name,
                    Description = project.Description,
                    //CampusId = project.Campus.CampusId,
                    //ProjectStatusId = projectStatus.ProjectStatusId
                };

                _context.Projects.Add(newProject);
                _context.SaveChanges();

            }

            else
            {

                newProject = _context.Projects.FirstOrDefault(m => m.ProjectId == project.ProjectId);
                //TODO: ellenőrzés, hogy van-e ilyen
            }

            ProjectCampus projectCampus = new ProjectCampus
            {
                ProjectId = newProject.ProjectId,
                CampusId = project.Campus.CampusId,
                ProjectStatusId = projectStatus.ProjectStatusId
            };

            _context.ProjectCampus.Add(projectCampus);
            _context.SaveChanges();

            return Ok();

        }

        /// <summary>
        /// Aktív projektek listázása a még nem elfogadott jelentkezésekkel
        /// </summary>
        [Authorize(Roles = "Admin, Mentor")]
        [HttpGet("subscriber/list")]
        public IList<ProjectViewModel> ListProjectSubscribersInCurrentCampus()
        {
            return _context.ProjectCampus
           .Include(m => m.SubscribedStudents)
           .Where(m => m.Campus.Active &&
                  m.ProjectStatus.Value == "Active")
           .Select(m => new ProjectViewModel
           {
               ProjectCampusId = m.ProjectCampusId,
               Name = m.Project.Name,
               SubscribedStudents = m.SubscribedStudents
               .Where(s => s.Deleted == false
              && s.Student.TeamMembers
                  .Count(teammember => teammember.ProjectCampusId == m.ProjectCampusId) == 0
               )
               .Select(
                   s => new SubscribedStudentViewModel
                   {
                       SubscribedStudentId = s.SubscribedStudentId,
                       Student = new Student
                       {
                           StudentId = s.Student.StudentId,
                           User = new User { Name = s.Student.User.Name }
                       }
                   }
               ).ToList(),
               SubscribedMentors = m.SubscribedMentors
               .Where(s => s.Deleted == false
                 && s.Mentor.ProjectLeaders
                     .Count(projectleader => projectleader.ProjectCampusId == m.ProjectCampusId) == 0
               )
               .Select(
                   s => new SubscribedMentorViewModel
                   {
                       SubscribedMentorId = s.SubscribedMentorId,
                       Mentor = new Mentor
                       {
                           MentorId = s.Mentor.MentorId,
                           User = new User { Name = s.Mentor.User.Name }
                       }
                   }
               ).ToList()
           }).ToList();

        }

    }

}