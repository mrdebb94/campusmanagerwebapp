using System;
using System.Collections.Generic; 

namespace EvoManager.Models {
	
	public class ProjectMeeting {
		
		public string ProjectMeetingId { get; set; }
		
		public virtual ProjectCampus ProjectCampus { get; set; }
		public string ProjectCampusId { get; set; }
		
		public DateTime StartTime { get; set; }
		public DateTime EndTime { get; set; }
		
		public string Description { get; set; }
		public string Room { get; set; }
		
		public bool IsCancelled { get; set; }
		
		public virtual ICollection<ProjectLeaderParticipationMeeting> ProjectLeaderParticipationMeetings { get; set; }
		public virtual ICollection<TeamMemberParticipationMeeting> TeamMemberParticipationMeetings { get; set; }
		
	} 
	
}