using System;
using System.Collections.Generic; 
using System.ComponentModel.DataAnnotations.Schema;

namespace EvoManager.Models
{
	public class Student {

	    /*public Student() {
			Campuses = new List<Campus>();
		}*/
	
		public string StudentId { get; set;}
		public bool HasScholarship { get; set; }
		
		[ForeignKey("User")]
		public string UserId { get; set; }
	    public virtual User User { get; set; }
		
		public bool IsDeleted { get; set; }
		
		
		public virtual ICollection<TeamMember> TeamMembers { get; set; }
		public virtual ICollection<SubscribedStudent> SubscribeStudents { get; set; }
		public virtual ICollection<CampusParticipation> CampusParticipations { get; set; }
		public virtual ICollection<StudentRating> StudentRatings { get; set; }
	}
}