using System;
using System.Collections.Generic; 

namespace EvoManager.Models {
	
	public class TeamMember {
		
		public string TeamMemberId { get; set; }
		
		public string ProjectCampusId { get; set; }
		public virtual ProjectCampus ProjectCampus { get; set; }
		
		public string StudentId { get; set; }
		public virtual Student Student { get; set; }
		
		public DateTime JoinDate { get; set; }
		
		public virtual ICollection<Task> Tasks { get; set; }
		public virtual ICollection<TeamMemberParticipationMeeting> TeamMemberParticipationMeetings { get; set; }
		
		public virtual ICollection<TeamMemberRating> TeamMemberRatings { get; set; }
		
	}
	
}