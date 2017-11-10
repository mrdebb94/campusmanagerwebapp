using System;
using System.Collections.Generic; 

namespace EvoManager.Models {
	
	public class ProjectLeader {
		
		public string ProjectLeaderId { get; set; }
		
		public string ProjectCampusId { get; set; }
		public virtual ProjectCampus ProjectCampus { get; set; }
		
		public string MentorId { get; set; }
		public virtual Mentor Mentor { get; set; }

		public DateTime JoinDate { get; set; }

		public virtual ICollection<ProjectLeaderParticipationMeeting> ProjectLeaderParticipationMeetings { get; set; }
		
	}
	
}