using EvoManager;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EvoManager.Models;
using EvoManager.ViewModels;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace evomanager_next.Hubs
{
    [Authorize]
    public class ProjectSubscribeHub:Hub
    {
        private readonly UserManager<EvoManager.Models.User> _userManager;
        private EvoDbContext _context;

        public ProjectSubscribeHub(EvoDbContext context, UserManager<EvoManager.Models.User> userManager) :base()
        {
            _userManager = userManager;
            _context = context;
        }

        /*public async Task SubscribeProject(string message)
        {
           
                //var user = await _userManager.GetUserAsync(Context.User);
                await Clients.All.SendAsync("ProjectSubscribeChange", Context.User.Identity.Name, message);
            
        }*/

        [Authorize(Roles = "Mentor, Student")]
        public async System.Threading.Tasks.Task SubscribeProject(string projectCampusId)
        {
            bool success = false;
            String returnMessage = "";
            DateTime currentDate = DateTime.Now;

            var user = await _userManager.GetUserAsync(Context.User);
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
                   .FirstOrDefault(m => m.ProjectCampusId == projectCampusId &&
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
                            success = true;
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
                            success = true;
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

            //await Clients.All.SendAsync("ProjectSubscribeChange", Context.User.Identity.Name, projectCampusId);
            //jelentkezés nem sikeres
            if (!success)
            {
                await Clients.Caller.SendAsync("ProjectSubscribeMessage", returnMessage);
            }
            else
            {
                await Clients.Caller.SendAsync("ProjectSubscribeMessage", returnMessage);
            }

            var list = _context.ProjectCampus
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
               Subscribed = ((campusParticipation.StudentId != null
                          && m.SubscribedStudents
                          .Count(s => s.ProjectCampusId == m.ProjectCampusId
                          && s.StudentId == campusParticipation.StudentId
                          && s.Deleted == false) != 0)
                          || (campusParticipation.MentorId != null
                          && m.SubscribedMentors
                          .Count(s => s.ProjectCampusId == m.ProjectCampusId
                          && s.MentorId == campusParticipation.MentorId
                          && s.Deleted == false) != 0))
           })
           .ToList();

            var serializerSettings = new JsonSerializerSettings();
            serializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            String listString = JsonConvert.SerializeObject(list, serializerSettings);

            await Clients.All.SendAsync("ProjectSubscribeChange", Context.User.Identity.Name, projectCampusId, listString);
        }

       

    }
}
