using System;
using System.Collections.Generic; 

namespace EvoManager.Models
{
	public class Project {

		public string ProjectId { get; set;}
		public string Name { get; set; }
		public string Description { get; set; }
		
		public string ProjectStatusId { get; set; }
		public virtual ProjectStatus ProjectStatus { get; set; }
		
		public string UserId { get; set; }
	    public virtual User User { get; set; }
		
		public string  CampusId { get; set; }
	    public virtual Campus Campus { get; set; }
		
		public string TfsProjectName { get; set; }
		public string TfsProjectURL { get; set;  }
		
		public virtual ICollection<SubscribedStudent> SubscribedStudents { get; set; }
		public virtual ICollection<SubscribedMentor> SubscribedMentors { get; set; }
		
		public virtual ICollection<TeamMember> TeamMembers { get; set; }
		public virtual ICollection<ProjectLeader> ProjectLeaders { get; set; }
		
		public virtual ICollection<Task> Tasks { get; set; }
		public virtual ICollection<ProjectMeeting> ProjectMeetings { get; set; }
		
	}
}