using System;
using System.Collections.Generic; 

namespace EvoManager.Models {
	
	public class SubscribedMentor {
		
		public string SubscribedMentorId { get; set; }
		
		public string ProjectCampusId { get; set; }
		public virtual ProjectCampus ProjectCampus { get; set; }
		
		public string MentorId { get; set; }
		public virtual Mentor Mentor{ get; set; }
		
		
		public DateTime SubscribedDate { get; set; }
	}
	
}