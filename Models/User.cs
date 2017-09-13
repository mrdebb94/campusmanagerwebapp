using System;
using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace EvoManager.Models
{
	public class User : IdentityUser{

		/*public string UserId { get; set;}
		public string Name { get; set; }
		public string Password { get; set; }
		public string Email { get; set; }*/
		
	
		public string StudentId { get; set; }
	    public virtual Student Student { get; set; }
		   
		public string MentorId { get; set; }
		public virtual Mentor Mentor { get; set; }
	
	    public string UserTypeId { get; set; }
		public virtual UserType UserType { get; set; }
	}
}