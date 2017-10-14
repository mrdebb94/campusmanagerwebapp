using System;
using System.Collections.Generic; 

namespace EvoManager.Models {
	
	public class SubscribedStudent {
		
		public string SubscribedStudentId { get; set; }
		
		public string ProjectCampusId { get; set; }
		public virtual ProjectCampus ProjectCampus { get; set; }
		
		public string StudentId { get; set; }
		public virtual Student Student { get; set; }
		
		public DateTime SubscribedDate { get; set; }
		
	}
	
}