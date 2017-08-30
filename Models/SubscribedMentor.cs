using System;
using System.Collections.Generic; 

namespace EvoManager.Models {
	
	public class SubscribedMentor {
		
		public string SubscribedMentorId { get; set; }
		
		public string ProjectId { get; set; }
		public virtual Project Project { get; set; }
		
		public string MentorId { get; set; }
		public virtual Mentor Mentor{ get; set; }
		
		
		public DateTime SubscribedDate { get; set; }
	}
	
}