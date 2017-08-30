using System;
using System.Collections.Generic; 

namespace EvoManager.Models {
	
	public class SubscribedStudent {
		
		public string SubscribedStudentId { get; set; }
		
		public string ProjectId { get; set; }
		public virtual Project Project { get; set; }
		
		public string StudentId { get; set; }
		public virtual Student Student { get; set; }
		
		public DateTime SubscribedDate { get; set; }
		
	}
	
}