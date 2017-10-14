using System;
using System.Collections.Generic; 
using System.ComponentModel.DataAnnotations.Schema;

namespace EvoManager.Models
{
	public class Mentor{

		public string MentorId { get; set;}
		public string Name { get; set; }
		public string Phone { get; set; }
		
        public bool IsDeleted { get; set; }

		[ForeignKey("User")]
		public string UserId { get; set; }
	    public virtual User User { get; set; }
		
		public virtual ICollection<SubscribedMentor> SubscribeMentors { get; set; }		
		public virtual ICollection<CampusParticipation> CampusParticipations { get; set; }
		public virtual ICollection<StudentRating> StudentRatings { get; set; }
		public virtual ICollection<ProjectLeader> ProjectLeaders { get; set; }
	}
}