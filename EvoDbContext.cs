using Microsoft.EntityFrameworkCore;
using EvoManager.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


namespace EvoManager {
	
	public class EvoDbContext : /*DbContext*/ IdentityDbContext<User>
    {
		
        public EvoDbContext(DbContextOptions<EvoDbContext> options) : base(options)
        {
        }

		/*protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
         
           
        }*/
		
        public DbSet<Campus> Campus { get; set; }
        public DbSet<CampusEvent> CampusEvents { get; set; }
        public DbSet<Student> Students { get; set; }
		public DbSet<Mentor> Mentors { get; set; }
		public DbSet<Project> Projects { get; set; }
		public DbSet<ProjectLeader> ProjectLeaders { get; set; }
		public DbSet<ProjectLeaderParticipationMeeting> ProjectLeaderParticipationMeetings { get; set; }
		public DbSet<TeamMemberParticipationMeeting> TeamMemberParticipationMeetings { get; set; }
		public DbSet<ProjectMeeting> ProjectMeetings { get; set; }
		public DbSet<ProjectStatus> ProjectStatus { get; set; }
		public DbSet<StudentRating> StudentRatings { get; set; }
		public DbSet<Task> Tasks { get; set; }
		public DbSet<TeamMember> TeamMembers { get; set; }
		public DbSet<TeamMemberRating> TeamMemberRatings { get; set; }
		//public DbSet<User> Users { get; set; }
		public DbSet<SubscribedStudent> SubscribedStudents { get; set; }
		public DbSet<SubscribedMentor> SubscribedMentors { get; set; }
    }
	
}