using System;
using System.Collections.Generic; 

namespace EvoManager.Models {
	
	public class ProjectLeader {
		
		public string ProjectLeaderId { get; set; }
		
		public string ProjectId { get; set; }
		public virtual Project Project { get; set; }
		
		public string MentorId { get; set; }
		public virtual Mentor Mentor{ get; set; }
		public virtual ICollection<ProjectLeaderParticipationMeeting> ProjectLeaderParticipationMeetings { get; set; }
		
	}
	
}