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
    public class ProjectDetailsController : Controller
    {
       private EvoDbContext _context;
	   private readonly UserManager<User> _userManager;
	   private readonly RoleManager<IdentityRole> _roleManager;
  
	   public ProjectDetailsController(EvoDbContext context,  UserManager<User> userManager,
          RoleManager<IdentityRole> roleManager,
		  IAntiforgery antiForgeryService)
        {
		  _context = context;  
		  _userManager = userManager;
		  _roleManager =  roleManager;
	    }

    [Authorize(Roles = "Mentor, Admin")]
    [HttpPost("teammembers/add")]
    [ValidateAntiForgeryToken]
    public async Task<ActionResult> AddTeamMemberToProject([FromBody][Bind("SubscribedStudentId")] 
       SubscribedStudentViewModel  subscribedStudent) 
      {
       //Csak akkor fogadhatja el a jelentkezést, ha 
       //ha annak a projektnek a mentora, amire a jelentkezés történt
       //még nem csapattag a diák ebbe a projektbe (és másikba se??)
           var user = await _userManager.GetUserAsync(HttpContext.User);
           IList<String>  roles = await _userManager.GetRolesAsync(user);

           if(roles.Contains("Mentor"))
           {
              var projectCampus = _context.SubscribedStudents
                       .Include(m=>m.ProjectCampus.ProjectLeaders)
                       .Include(m=>m.ProjectCampus.TeamMembers)
                       .Where(m=>m.SubscribedStudentId ==  subscribedStudent.SubscribedStudentId
                       && m.ProjectCampus.Campus.Active
                       && m.ProjectCampus.ProjectLeaders.Count(s=>s.Mentor.UserId == user.Id)==1
                       && m.ProjectCampus.TeamMembers.Count(s=>s.StudentId == m.StudentId)==0)
                       .Select( m => new {
                           ProjectCampusId = m.ProjectCampusId,
                           StudentId = m.StudentId
                       })
                       .FirstOrDefault();
              
              if(projectCampus!=null)
              {
                  TeamMember teamMember = new TeamMember {
                      StudentId = projectCampus.StudentId,
                      ProjectCampusId = projectCampus.ProjectCampusId,
                      JoinDate = DateTime.Now
                  };

                  _context.TeamMembers.Add(teamMember);
                  _context.SaveChanges();

              } else {
                
                   return Ok(Json("Nem hagyhatja jóvá a jelentkezést!"));
              }
                       
           } 
           else 
           {
               var projectCampus = _context.SubscribedStudents
                       .Include(m=>m.ProjectCampus.ProjectLeaders)
                       .Where(m=>m.SubscribedStudentId ==  subscribedStudent.SubscribedStudentId
                       && m.ProjectCampus.Campus.Active
                       && m.ProjectCampus.TeamMembers.Count(s=>s.StudentId == m.StudentId)==0)
                       .Select( m => new {
                           ProjectCampusId = m.ProjectCampusId,
                           StudentId = m.StudentId
                       })
                       .FirstOrDefault();
              
              if(projectCampus!=null)
              {
                  TeamMember teamMember = new TeamMember {
                      StudentId = projectCampus.StudentId,
                      ProjectCampusId = projectCampus.ProjectCampusId,
                      JoinDate = DateTime.Now
                  };

                  _context.TeamMembers.Add(teamMember);
                  _context.SaveChanges();

              } else {
                
                   return Ok(Json("Nem hagyhatja jóvá a jelentkezést!"));
              }
           }
             return Ok(Json("Sikeres jóváhagyás!"));
      }

    [Authorize(Roles = "Mentor, Admin")]
    [HttpPost("projectleaders/add")]
    [ValidateAntiForgeryToken]
    public async Task<ActionResult> AddProjectLeaderToProject([FromBody][Bind("SubscribedMentorId")] 
       SubscribedMentorViewModel  subscribedMentor) 
      {
       //Csak akkor fogadhatja el a jelentkezést, ha 
       //ha annak a projektnek a mentora, amire a jelentkezés történt
       //még nem csapattag a diák ebbe a projektbe (és másikba se??)
           var user = await _userManager.GetUserAsync(HttpContext.User);
           IList<String>  roles = await _userManager.GetRolesAsync(user);

           if(roles.Contains("Mentor"))
           {
              var projectCampus = _context.SubscribedMentors
                       .Include(m=>m.ProjectCampus.ProjectLeaders)
                       .Where(m=>m.SubscribedMentorId ==  subscribedMentor.SubscribedMentorId
                       && m.ProjectCampus.Campus.Active
                       && m.ProjectCampus.ProjectLeaders.Count(s=>s.Mentor.UserId == user.Id)==1
                       && m.ProjectCampus.ProjectLeaders.Count(s=>s.MentorId == m.MentorId)==0)
                       .Select( m => new {
                           ProjectCampusId = m.ProjectCampusId,
                           MentorId = m.MentorId
                       })
                       .FirstOrDefault();
              
              if(projectCampus!=null)
              {
                  ProjectLeader projectLeader = new ProjectLeader {
                      MentorId = projectCampus.MentorId,
                      ProjectCampusId = projectCampus.ProjectCampusId,
                      JoinDate = DateTime.Now
                  };

                  _context.ProjectLeaders.Add(projectLeader);
                  _context.SaveChanges();

              } else {
                
                   return Ok(Json("Nem hagyhatja jóvá a jelentkezést!"));
              }
                       
           } 
           else 
           {
            var projectCampus = _context.SubscribedMentors
                       .Include(m=>m.ProjectCampus.ProjectLeaders)
                       .Where(m=>m.SubscribedMentorId ==  subscribedMentor.SubscribedMentorId
                       && m.ProjectCampus.Campus.Active
                       && m.ProjectCampus.ProjectLeaders.Count(s=>s.MentorId == m.MentorId)==0)
                       .Select( m => new {
                           ProjectCampusId = m.ProjectCampusId,
                           MentorId = m.MentorId
                       })
                       .FirstOrDefault();
              
              if(projectCampus!=null)
              {
                  ProjectLeader projectLeader = new ProjectLeader {
                      MentorId = projectCampus.MentorId,
                      ProjectCampusId = projectCampus.ProjectCampusId,
                      JoinDate = DateTime.Now
                  };

                  _context.ProjectLeaders.Add(projectLeader);
                  _context.SaveChanges();

              } else {
                
                   return Ok(Json("Nem hagyhatja jóvá a jelentkezést!"));
              }
                          
           }
             return Ok(Json("Sikeres jóváhagyás!"));
      }


    [Authorize(Roles = "Student, Mentor")]
    [HttpGet("projectmeetings/list")]
    public async Task<IEnumerable<ProjectMeetingViewModel>> 
            ListProjectMeetingInCurrentProject() {
       
           var user = await _userManager.GetUserAsync(HttpContext.User);
           IList<String>  roles = await _userManager.GetRolesAsync(user);

           ProjectCampus projectCampus = null;

           if(roles.Contains("Mentor"))
           {
             projectCampus =  _context
              .ProjectCampus
              .Include(m=>m.ProjectLeaders)
              .Where( m=> m.Campus.Active
              && m.ProjectLeaders.Count(s=>s.Mentor.UserId == user.Id)>0
              )
              .FirstOrDefault();
           }
            
           List<ProjectMeetingViewModel> projectMeetings = new List<ProjectMeetingViewModel>();

           if(projectCampus!=null) {

                projectMeetings = _context
                .ProjectMeetings
                .Where(m=>m.ProjectCampusId == projectCampus.ProjectCampusId )
                .Select(m=>new ProjectMeetingViewModel {
                   ProjectMeetingId = m.ProjectMeetingId,
                   StartTime = m.StartTime,
                   EndTime = m.EndTime,
                   Room = m.Room,
                   Description = m.Description
                }).ToList(); 

           }

           return projectMeetings;
    }


    [Authorize(Roles = "Mentor, Admin")]
    [HttpPost("projectmeetings/add")]
    [ValidateAntiForgeryToken]
    public async Task<ActionResult> AddProjectMeeting([FromBody][Bind("StartTime", "EndTime", 
    "Room", "Description")] 
       ProjectMeetingViewModel projectMeetingViewModel) 
      {
           var user = await _userManager.GetUserAsync(HttpContext.User);
           IList<String>  roles = await _userManager.GetRolesAsync(user);

           ProjectCampus projectCampus = null;

           if(roles.Contains("Mentor"))
           {
             projectCampus =  _context
              .ProjectCampus
              .Include(m=>m.ProjectLeaders)
              .Where(m=>m.Campus.Active
              && m.ProjectLeaders.Count(s=>s.Mentor.UserId == user.Id)>0
              )
              .FirstOrDefault();
           }  else {
               projectCampus =  _context
              .ProjectCampus
              .Include(m=>m.ProjectLeaders)
              .Where(m=>m.ProjectCampusId == projectMeetingViewModel.ProjectCampusId
              && m.Campus.Active
              )
              .FirstOrDefault();
           }

              if(projectCampus!=null) {

                ProjectMeeting projectMeeting = new ProjectMeeting {
                  ProjectCampusId = projectCampus.ProjectCampusId,
                  StartTime =  projectMeetingViewModel.StartTime,
                  EndTime = projectMeetingViewModel.EndTime,
                  Description =  projectMeetingViewModel.Description,
                  Room = projectMeetingViewModel.Room
                };
                
                _context.ProjectMeetings.Add(projectMeeting);
                _context.SaveChanges();

                var teamMembers = _context
                .TeamMembers
                .Where(m=>m.ProjectCampusId ==  projectCampus.ProjectCampusId);

                foreach(var teamMember in teamMembers) {
                    TeamMemberParticipationMeeting  teamMemberParticipationMeeting = 
                    new TeamMemberParticipationMeeting {
                        TeamMemberId = teamMember.TeamMemberId,
                        ProjectMeetingId = projectMeeting.ProjectMeetingId
                    };

                    _context.TeamMemberParticipationMeetings.Add(teamMemberParticipationMeeting);
                }

                var projectLeaders = _context
                .ProjectLeaders
                .Where(m=>m.ProjectCampusId ==  projectCampus.ProjectCampusId);

                foreach(var projectLeader in projectLeaders) {
                    ProjectLeaderParticipationMeeting  projectLeaderParticipationMeeting = 
                    new ProjectLeaderParticipationMeeting {
                        ProjectLeaderId = projectLeader.ProjectLeaderId,
                        ProjectMeetingId = projectMeeting.ProjectMeetingId
                    };

                    _context.ProjectLeaderParticipationMeetings.Add(projectLeaderParticipationMeeting);
                }

                 _context.SaveChanges();

                /* 
                if(projectMeetingViewModel.HasWeekly) 
                {
                    DateTime nextWeekStart = projectMeetingViewModel.StartTime.AddDays(7);
                    DateTime nextWeekEnd = projectMeetingViewModel.EndTime.AddDays(7);
                    projectMeeting.StartTime = nextWeekStart;
                    projectMeeting.EndTime = nextWeekEnd;
                    _context.ProjectMeetings.Add(projectMeeting);
                }  
                

               _context.SaveChanges();

               */
            
              }
           

         return Ok(Json("Sikeres hozzáadás!"));
      }

      [Authorize(Roles = "Student, Mentor, Admin")]
      [HttpGet("projectmeetings/details/{id}")]
      public ProjectMeetingViewModel ProjectMeetingDetails(string id) 
      {
        return _context
         .ProjectMeetings
         .Include(m=>m.ProjectLeaderParticipationMeetings)
         .Include(m=>m.TeamMemberParticipationMeetings)
         .Where(m=>m.ProjectMeetingId ==  id)
         .Select(m=> new ProjectMeetingViewModel {
            StartTime = m.StartTime,
            EndTime = m.EndTime,
            TeamMemberParticipationMeetings = m.TeamMemberParticipationMeetings
            .Select(s=>new TeamMemberParticipationMeeting {
                TeamMember = new TeamMember {
                    TeamMemberId = s.TeamMemberId,
                    Student = new Student {
                        Name = s.TeamMember.Student.Name
                    }
                },
                Checked = s.Checked
            }).ToList(),
            ProjectLeaderParticipationMeetings = m.ProjectLeaderParticipationMeetings
            .Select(s=>new ProjectLeaderParticipationMeeting {
                ProjectLeader = new ProjectLeader {
                    ProjectLeaderId = s.ProjectLeaderId,
                    Mentor = new Mentor {
                        Name = s.ProjectLeader.Mentor.Name
                    }
                },
                Checked = s.Checked
            }).ToList()
         }).First();

      }

    }
}