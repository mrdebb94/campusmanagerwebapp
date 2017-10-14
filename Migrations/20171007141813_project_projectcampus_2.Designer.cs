﻿// <auto-generated />
using EvoManager;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using System;

namespace EvoManager.Migrations
{
    [DbContext(typeof(EvoDbContext))]
    [Migration("20171007141813_project_projectcampus_2")]
    partial class project_projectcampus_2
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.0-rtm-26452")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("EvoManager.Models.Campus", b =>
                {
                    b.Property<string>("CampusId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Active");

                    b.Property<DateTime>("EndDate");

                    b.Property<DateTime>("StartDate");

                    b.HasKey("CampusId");

                    b.ToTable("Campus");
                });

            modelBuilder.Entity("EvoManager.Models.CampusEvent", b =>
                {
                    b.Property<string>("CampusEventId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CampusId");

                    b.Property<string>("Description");

                    b.Property<DateTime>("EndTime");

                    b.Property<bool>("IsCancelled");

                    b.Property<string>("Room");

                    b.Property<DateTime>("StartTime");

                    b.Property<string>("Title");

                    b.HasKey("CampusEventId");

                    b.HasIndex("CampusId");

                    b.ToTable("CampusEvents");
                });

            modelBuilder.Entity("EvoManager.Models.CampusParticipation", b =>
                {
                    b.Property<string>("CampusParticipationId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CampusId");

                    b.Property<string>("MentorId");

                    b.Property<string>("StudentId");

                    b.HasKey("CampusParticipationId");

                    b.HasIndex("CampusId");

                    b.HasIndex("MentorId");

                    b.HasIndex("StudentId");

                    b.ToTable("CampusParticipations");
                });

            modelBuilder.Entity("EvoManager.Models.CampusState", b =>
                {
                    b.Property<string>("CampusStateId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CampusId");

                    b.Property<int>("CampusStateValue");

                    b.Property<DateTime>("EndDate");

                    b.Property<DateTime>("StartDate");

                    b.HasKey("CampusStateId");

                    b.HasIndex("CampusId");

                    b.ToTable("CampusState");
                });

            modelBuilder.Entity("EvoManager.Models.Mentor", b =>
                {
                    b.Property<string>("MentorId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("Name");

                    b.Property<string>("Phone");

                    b.Property<string>("UserId");

                    b.HasKey("MentorId");

                    b.HasIndex("UserId")
                        .IsUnique()
                        .HasFilter("[UserId] IS NOT NULL");

                    b.ToTable("Mentors");
                });

            modelBuilder.Entity("EvoManager.Models.Project", b =>
                {
                    b.Property<string>("ProjectId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<string>("Name");

                    b.HasKey("ProjectId");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("EvoManager.Models.ProjectCampus", b =>
                {
                    b.Property<string>("ProjectCampusId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CampusId");

                    b.Property<string>("ProjectId");

                    b.Property<string>("ProjectStatusId");

                    b.Property<string>("TfsProjectName");

                    b.Property<string>("TfsProjectURL");

                    b.Property<string>("UserId");

                    b.HasKey("ProjectCampusId");

                    b.HasIndex("CampusId");

                    b.HasIndex("ProjectId");

                    b.HasIndex("ProjectStatusId");

                    b.HasIndex("UserId");

                    b.ToTable("ProjectCampus");
                });

            modelBuilder.Entity("EvoManager.Models.ProjectLeader", b =>
                {
                    b.Property<string>("ProjectLeaderId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("MentorId");

                    b.Property<string>("ProjectCampusId");

                    b.HasKey("ProjectLeaderId");

                    b.HasIndex("MentorId");

                    b.HasIndex("ProjectCampusId");

                    b.ToTable("ProjectLeaders");
                });

            modelBuilder.Entity("EvoManager.Models.ProjectLeaderParticipationMeeting", b =>
                {
                    b.Property<string>("ProjectLeaderParticipationMeetingId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Checked");

                    b.Property<bool>("Planned");

                    b.Property<string>("ProjectLeaderId");

                    b.Property<string>("ProjectMeetingId");

                    b.HasKey("ProjectLeaderParticipationMeetingId");

                    b.HasIndex("ProjectLeaderId");

                    b.HasIndex("ProjectMeetingId");

                    b.ToTable("ProjectLeaderParticipationMeetings");
                });

            modelBuilder.Entity("EvoManager.Models.ProjectMeeting", b =>
                {
                    b.Property<string>("ProjectMeetingId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<DateTime>("EndTime");

                    b.Property<bool>("IsCancelled");

                    b.Property<string>("ProjectCampusId");

                    b.Property<string>("Room");

                    b.Property<DateTime>("StartTime");

                    b.HasKey("ProjectMeetingId");

                    b.HasIndex("ProjectCampusId");

                    b.ToTable("ProjectMeetings");
                });

            modelBuilder.Entity("EvoManager.Models.ProjectStatus", b =>
                {
                    b.Property<string>("ProjectStatusId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Value");

                    b.HasKey("ProjectStatusId");

                    b.ToTable("ProjectStatus");
                });

            modelBuilder.Entity("EvoManager.Models.Student", b =>
                {
                    b.Property<string>("StudentId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("HasScholarship");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("Name");

                    b.Property<string>("Phone");

                    b.Property<string>("UserId");

                    b.HasKey("StudentId");

                    b.HasIndex("UserId")
                        .IsUnique()
                        .HasFilter("[UserId] IS NOT NULL");

                    b.ToTable("Students");
                });

            modelBuilder.Entity("EvoManager.Models.StudentRating", b =>
                {
                    b.Property<string>("StudentRatingId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Active");

                    b.Property<string>("CampusId");

                    b.Property<string>("MentorId");

                    b.Property<string>("StudentId");

                    b.Property<string>("Text");

                    b.HasKey("StudentRatingId");

                    b.HasIndex("CampusId");

                    b.HasIndex("MentorId");

                    b.HasIndex("StudentId");

                    b.ToTable("StudentRatings");
                });

            modelBuilder.Entity("EvoManager.Models.SubscribedMentor", b =>
                {
                    b.Property<string>("SubscribedMentorId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("MentorId");

                    b.Property<string>("ProjectCampusId");

                    b.Property<DateTime>("SubscribedDate");

                    b.HasKey("SubscribedMentorId");

                    b.HasIndex("MentorId");

                    b.HasIndex("ProjectCampusId");

                    b.ToTable("SubscribedMentors");
                });

            modelBuilder.Entity("EvoManager.Models.SubscribedStudent", b =>
                {
                    b.Property<string>("SubscribedStudentId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ProjectCampusId");

                    b.Property<string>("StudentId");

                    b.Property<DateTime>("SubscribedDate");

                    b.HasKey("SubscribedStudentId");

                    b.HasIndex("ProjectCampusId");

                    b.HasIndex("StudentId");

                    b.ToTable("SubscribedStudents");
                });

            modelBuilder.Entity("EvoManager.Models.Task", b =>
                {
                    b.Property<string>("TaskId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Accept");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Description");

                    b.Property<string>("ProjectCampusId");

                    b.Property<bool>("Status");

                    b.Property<string>("TeamMemberId");

                    b.Property<string>("TfsWorkItemId");

                    b.Property<string>("Title");

                    b.HasKey("TaskId");

                    b.HasIndex("ProjectCampusId");

                    b.HasIndex("TeamMemberId");

                    b.ToTable("Tasks");
                });

            modelBuilder.Entity("EvoManager.Models.TeamMember", b =>
                {
                    b.Property<string>("TeamMemberId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("JoinDate");

                    b.Property<string>("ProjectCampusId");

                    b.Property<string>("StudentId");

                    b.HasKey("TeamMemberId");

                    b.HasIndex("ProjectCampusId");

                    b.HasIndex("StudentId");

                    b.ToTable("TeamMembers");
                });

            modelBuilder.Entity("EvoManager.Models.TeamMemberParticipationMeeting", b =>
                {
                    b.Property<string>("TeamMemberParticipationMeetingId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Checked");

                    b.Property<bool>("Planned");

                    b.Property<string>("ProjectMeetingId");

                    b.Property<string>("TeamMemberId");

                    b.HasKey("TeamMemberParticipationMeetingId");

                    b.HasIndex("ProjectMeetingId");

                    b.HasIndex("TeamMemberId");

                    b.ToTable("TeamMemberParticipationMeetings");
                });

            modelBuilder.Entity("EvoManager.Models.TeamMemberRating", b =>
                {
                    b.Property<string>("TeamMemberRatingId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Active");

                    b.Property<string>("ProjectLeaderId");

                    b.Property<string>("TeamMemberId");

                    b.Property<string>("TeamMemberParticipationMeetingId");

                    b.Property<string>("Text");

                    b.HasKey("TeamMemberRatingId");

                    b.HasIndex("ProjectLeaderId");

                    b.HasIndex("TeamMemberId");

                    b.HasIndex("TeamMemberParticipationMeetingId");

                    b.ToTable("TeamMemberRatings");
                });

            modelBuilder.Entity("EvoManager.Models.User", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("CampusEventId");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("MentorId");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<string>("StudentId");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.Property<string>("UserTypeId");

                    b.HasKey("Id");

                    b.HasIndex("CampusEventId");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.HasIndex("UserTypeId");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("EvoManager.Models.UserType", b =>
                {
                    b.Property<string>("UserTypeId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Value");

                    b.HasKey("UserTypeId");

                    b.ToTable("UserType");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("EvoManager.Models.CampusEvent", b =>
                {
                    b.HasOne("EvoManager.Models.Campus", "Campus")
                        .WithMany("CampusEvents")
                        .HasForeignKey("CampusId");
                });

            modelBuilder.Entity("EvoManager.Models.CampusParticipation", b =>
                {
                    b.HasOne("EvoManager.Models.Campus", "Campus")
                        .WithMany("CampusParticipations")
                        .HasForeignKey("CampusId");

                    b.HasOne("EvoManager.Models.Mentor", "Mentor")
                        .WithMany("CampusParticipations")
                        .HasForeignKey("MentorId");

                    b.HasOne("EvoManager.Models.Student", "Student")
                        .WithMany("CampusParticipations")
                        .HasForeignKey("StudentId");
                });

            modelBuilder.Entity("EvoManager.Models.CampusState", b =>
                {
                    b.HasOne("EvoManager.Models.Campus", "Campus")
                        .WithMany("CampusStates")
                        .HasForeignKey("CampusId");
                });

            modelBuilder.Entity("EvoManager.Models.Mentor", b =>
                {
                    b.HasOne("EvoManager.Models.User", "User")
                        .WithOne("Mentor")
                        .HasForeignKey("EvoManager.Models.Mentor", "UserId");
                });

            modelBuilder.Entity("EvoManager.Models.ProjectCampus", b =>
                {
                    b.HasOne("EvoManager.Models.Campus", "Campus")
                        .WithMany("ProjectCampus")
                        .HasForeignKey("CampusId");

                    b.HasOne("EvoManager.Models.Project", "Project")
                        .WithMany("ProjectCampus")
                        .HasForeignKey("ProjectId");

                    b.HasOne("EvoManager.Models.ProjectStatus", "ProjectStatus")
                        .WithMany()
                        .HasForeignKey("ProjectStatusId");

                    b.HasOne("EvoManager.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("EvoManager.Models.ProjectLeader", b =>
                {
                    b.HasOne("EvoManager.Models.Mentor", "Mentor")
                        .WithMany("ProjectLeaders")
                        .HasForeignKey("MentorId");

                    b.HasOne("EvoManager.Models.ProjectCampus", "ProjectCampus")
                        .WithMany("ProjectLeaders")
                        .HasForeignKey("ProjectCampusId");
                });

            modelBuilder.Entity("EvoManager.Models.ProjectLeaderParticipationMeeting", b =>
                {
                    b.HasOne("EvoManager.Models.ProjectLeader", "ProjectLeader")
                        .WithMany("ProjectLeaderParticipationMeetings")
                        .HasForeignKey("ProjectLeaderId");

                    b.HasOne("EvoManager.Models.ProjectMeeting", "ProjectMeeting")
                        .WithMany("ProjectLeaderParticipationMeetings")
                        .HasForeignKey("ProjectMeetingId");
                });

            modelBuilder.Entity("EvoManager.Models.ProjectMeeting", b =>
                {
                    b.HasOne("EvoManager.Models.ProjectCampus", "ProjectCampus")
                        .WithMany("ProjectMeetings")
                        .HasForeignKey("ProjectCampusId");
                });

            modelBuilder.Entity("EvoManager.Models.Student", b =>
                {
                    b.HasOne("EvoManager.Models.User", "User")
                        .WithOne("Student")
                        .HasForeignKey("EvoManager.Models.Student", "UserId");
                });

            modelBuilder.Entity("EvoManager.Models.StudentRating", b =>
                {
                    b.HasOne("EvoManager.Models.Campus", "Campus")
                        .WithMany("StudentRatings")
                        .HasForeignKey("CampusId");

                    b.HasOne("EvoManager.Models.Mentor", "Mentor")
                        .WithMany("StudentRatings")
                        .HasForeignKey("MentorId");

                    b.HasOne("EvoManager.Models.Student", "Student")
                        .WithMany("StudentRatings")
                        .HasForeignKey("StudentId");
                });

            modelBuilder.Entity("EvoManager.Models.SubscribedMentor", b =>
                {
                    b.HasOne("EvoManager.Models.Mentor", "Mentor")
                        .WithMany("SubscribeMentors")
                        .HasForeignKey("MentorId");

                    b.HasOne("EvoManager.Models.ProjectCampus", "ProjectCampus")
                        .WithMany("SubscribedMentors")
                        .HasForeignKey("ProjectCampusId");
                });

            modelBuilder.Entity("EvoManager.Models.SubscribedStudent", b =>
                {
                    b.HasOne("EvoManager.Models.ProjectCampus", "ProjectCampus")
                        .WithMany("SubscribedStudents")
                        .HasForeignKey("ProjectCampusId");

                    b.HasOne("EvoManager.Models.Student", "Student")
                        .WithMany("SubscribeStudents")
                        .HasForeignKey("StudentId");
                });

            modelBuilder.Entity("EvoManager.Models.Task", b =>
                {
                    b.HasOne("EvoManager.Models.ProjectCampus", "ProjectCampus")
                        .WithMany("Tasks")
                        .HasForeignKey("ProjectCampusId");

                    b.HasOne("EvoManager.Models.TeamMember", "TeamMember")
                        .WithMany("Tasks")
                        .HasForeignKey("TeamMemberId");
                });

            modelBuilder.Entity("EvoManager.Models.TeamMember", b =>
                {
                    b.HasOne("EvoManager.Models.ProjectCampus", "ProjectCampus")
                        .WithMany("TeamMembers")
                        .HasForeignKey("ProjectCampusId");

                    b.HasOne("EvoManager.Models.Student", "Student")
                        .WithMany("TeamMembers")
                        .HasForeignKey("StudentId");
                });

            modelBuilder.Entity("EvoManager.Models.TeamMemberParticipationMeeting", b =>
                {
                    b.HasOne("EvoManager.Models.ProjectMeeting", "ProjectMeeting")
                        .WithMany("TeamMemberParticipationMeetings")
                        .HasForeignKey("ProjectMeetingId");

                    b.HasOne("EvoManager.Models.TeamMember", "TeamMember")
                        .WithMany("TeamMemberParticipationMeetings")
                        .HasForeignKey("TeamMemberId");
                });

            modelBuilder.Entity("EvoManager.Models.TeamMemberRating", b =>
                {
                    b.HasOne("EvoManager.Models.ProjectLeader", "ProjectLeader")
                        .WithMany()
                        .HasForeignKey("ProjectLeaderId");

                    b.HasOne("EvoManager.Models.TeamMember")
                        .WithMany("TeamMemberRatings")
                        .HasForeignKey("TeamMemberId");

                    b.HasOne("EvoManager.Models.TeamMemberParticipationMeeting", "TeamMemberParticipationMeeting")
                        .WithMany("TeamMemberRatings")
                        .HasForeignKey("TeamMemberParticipationMeetingId");
                });

            modelBuilder.Entity("EvoManager.Models.User", b =>
                {
                    b.HasOne("EvoManager.Models.CampusEvent")
                        .WithMany("User")
                        .HasForeignKey("CampusEventId");

                    b.HasOne("EvoManager.Models.UserType", "UserType")
                        .WithMany()
                        .HasForeignKey("UserTypeId");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("EvoManager.Models.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("EvoManager.Models.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("EvoManager.Models.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("EvoManager.Models.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
