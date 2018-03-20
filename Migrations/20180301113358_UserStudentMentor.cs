using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace evomanager_next.Migrations
{
    public partial class UserStudentMentor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Campus",
                columns: table => new
                {
                    CampusId = table.Column<string>(nullable: false),
                    Active = table.Column<bool>(nullable: false),
                    EndDate = table.Column<DateTime>(nullable: false),
                    StartDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Campus", x => x.CampusId);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    ProjectId = table.Column<string>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.ProjectId);
                });

            migrationBuilder.CreateTable(
                name: "ProjectStatus",
                columns: table => new
                {
                    ProjectStatusId = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectStatus", x => x.ProjectStatusId);
                });

            migrationBuilder.CreateTable(
                name: "ReportResults",
                columns: table => new
                {
                    ReportResultId = table.Column<string>(nullable: false),
                    Xml = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportResults", x => x.ReportResultId);
                });

            migrationBuilder.CreateTable(
                name: "UserType",
                columns: table => new
                {
                    UserTypeId = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserType", x => x.UserTypeId);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true),
                    RoleId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CampusEvents",
                columns: table => new
                {
                    CampusEventId = table.Column<string>(nullable: false),
                    CampusId = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    EndTime = table.Column<DateTime>(nullable: false),
                    IsCancelled = table.Column<bool>(nullable: false),
                    Room = table.Column<string>(nullable: true),
                    StartTime = table.Column<DateTime>(nullable: false),
                    Title = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CampusEvents", x => x.CampusEventId);
                    table.ForeignKey(
                        name: "FK_CampusEvents_Campus_CampusId",
                        column: x => x.CampusId,
                        principalTable: "Campus",
                        principalColumn: "CampusId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CampusState",
                columns: table => new
                {
                    CampusStateId = table.Column<string>(nullable: false),
                    CampusId = table.Column<string>(nullable: true),
                    CampusStateValue = table.Column<int>(nullable: false),
                    EndDate = table.Column<DateTime>(nullable: false),
                    StartDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CampusState", x => x.CampusStateId);
                    table.ForeignKey(
                        name: "FK_CampusState_Campus_CampusId",
                        column: x => x.CampusId,
                        principalTable: "Campus",
                        principalColumn: "CampusId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    CampusEventId = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    MentorId = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    PasswordHash = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    SecurityStamp = table.Column<string>(nullable: true),
                    StudentId = table.Column<string>(nullable: true),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    UserTypeId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUsers_CampusEvents_CampusEventId",
                        column: x => x.CampusEventId,
                        principalTable: "CampusEvents",
                        principalColumn: "CampusEventId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AspNetUsers_UserType_UserTypeId",
                        column: x => x.UserTypeId,
                        principalTable: "UserType",
                        principalColumn: "UserTypeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    RoleId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Mentors",
                columns: table => new
                {
                    MentorId = table.Column<string>(nullable: false),
                    IsDeleted = table.Column<bool>(nullable: false),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mentors", x => x.MentorId);
                    table.ForeignKey(
                        name: "FK_Mentors_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProjectCampus",
                columns: table => new
                {
                    ProjectCampusId = table.Column<string>(nullable: false),
                    CampusId = table.Column<string>(nullable: true),
                    ProjectId = table.Column<string>(nullable: true),
                    ProjectStatusId = table.Column<string>(nullable: true),
                    TfsProjectName = table.Column<string>(nullable: true),
                    TfsProjectURL = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectCampus", x => x.ProjectCampusId);
                    table.ForeignKey(
                        name: "FK_ProjectCampus_Campus_CampusId",
                        column: x => x.CampusId,
                        principalTable: "Campus",
                        principalColumn: "CampusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectCampus_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectCampus_ProjectStatus_ProjectStatusId",
                        column: x => x.ProjectStatusId,
                        principalTable: "ProjectStatus",
                        principalColumn: "ProjectStatusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectCampus_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    StudentId = table.Column<string>(nullable: false),
                    HasScholarship = table.Column<bool>(nullable: false),
                    IsDeleted = table.Column<bool>(nullable: false),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.StudentId);
                    table.ForeignKey(
                        name: "FK_Students_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProjectLeaders",
                columns: table => new
                {
                    ProjectLeaderId = table.Column<string>(nullable: false),
                    JoinDate = table.Column<DateTime>(nullable: false),
                    MentorId = table.Column<string>(nullable: true),
                    ProjectCampusId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectLeaders", x => x.ProjectLeaderId);
                    table.ForeignKey(
                        name: "FK_ProjectLeaders_Mentors_MentorId",
                        column: x => x.MentorId,
                        principalTable: "Mentors",
                        principalColumn: "MentorId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectLeaders_ProjectCampus_ProjectCampusId",
                        column: x => x.ProjectCampusId,
                        principalTable: "ProjectCampus",
                        principalColumn: "ProjectCampusId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProjectMeetings",
                columns: table => new
                {
                    ProjectMeetingId = table.Column<string>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    EndTime = table.Column<DateTime>(nullable: false),
                    IsCancelled = table.Column<bool>(nullable: false),
                    ProjectCampusId = table.Column<string>(nullable: true),
                    Room = table.Column<string>(nullable: true),
                    StartTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectMeetings", x => x.ProjectMeetingId);
                    table.ForeignKey(
                        name: "FK_ProjectMeetings_ProjectCampus_ProjectCampusId",
                        column: x => x.ProjectCampusId,
                        principalTable: "ProjectCampus",
                        principalColumn: "ProjectCampusId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SubscribedMentors",
                columns: table => new
                {
                    SubscribedMentorId = table.Column<string>(nullable: false),
                    Deleted = table.Column<bool>(nullable: false),
                    MentorId = table.Column<string>(nullable: true),
                    ProjectCampusId = table.Column<string>(nullable: true),
                    SubscribedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubscribedMentors", x => x.SubscribedMentorId);
                    table.ForeignKey(
                        name: "FK_SubscribedMentors_Mentors_MentorId",
                        column: x => x.MentorId,
                        principalTable: "Mentors",
                        principalColumn: "MentorId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SubscribedMentors_ProjectCampus_ProjectCampusId",
                        column: x => x.ProjectCampusId,
                        principalTable: "ProjectCampus",
                        principalColumn: "ProjectCampusId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CampusParticipations",
                columns: table => new
                {
                    CampusParticipationId = table.Column<string>(nullable: false),
                    CampusId = table.Column<string>(nullable: true),
                    MentorId = table.Column<string>(nullable: true),
                    StudentId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CampusParticipations", x => x.CampusParticipationId);
                    table.ForeignKey(
                        name: "FK_CampusParticipations_Campus_CampusId",
                        column: x => x.CampusId,
                        principalTable: "Campus",
                        principalColumn: "CampusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CampusParticipations_Mentors_MentorId",
                        column: x => x.MentorId,
                        principalTable: "Mentors",
                        principalColumn: "MentorId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CampusParticipations_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "StudentRatings",
                columns: table => new
                {
                    StudentRatingId = table.Column<string>(nullable: false),
                    Active = table.Column<bool>(nullable: false),
                    CampusId = table.Column<string>(nullable: true),
                    MentorId = table.Column<string>(nullable: true),
                    StudentId = table.Column<string>(nullable: true),
                    Text = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentRatings", x => x.StudentRatingId);
                    table.ForeignKey(
                        name: "FK_StudentRatings_Campus_CampusId",
                        column: x => x.CampusId,
                        principalTable: "Campus",
                        principalColumn: "CampusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StudentRatings_Mentors_MentorId",
                        column: x => x.MentorId,
                        principalTable: "Mentors",
                        principalColumn: "MentorId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StudentRatings_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SubscribedStudents",
                columns: table => new
                {
                    SubscribedStudentId = table.Column<string>(nullable: false),
                    Deleted = table.Column<bool>(nullable: false),
                    ProjectCampusId = table.Column<string>(nullable: true),
                    StudentId = table.Column<string>(nullable: true),
                    SubscribedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubscribedStudents", x => x.SubscribedStudentId);
                    table.ForeignKey(
                        name: "FK_SubscribedStudents_ProjectCampus_ProjectCampusId",
                        column: x => x.ProjectCampusId,
                        principalTable: "ProjectCampus",
                        principalColumn: "ProjectCampusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SubscribedStudents_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TeamMembers",
                columns: table => new
                {
                    TeamMemberId = table.Column<string>(nullable: false),
                    JoinDate = table.Column<DateTime>(nullable: false),
                    ProjectCampusId = table.Column<string>(nullable: true),
                    StudentId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamMembers", x => x.TeamMemberId);
                    table.ForeignKey(
                        name: "FK_TeamMembers_ProjectCampus_ProjectCampusId",
                        column: x => x.ProjectCampusId,
                        principalTable: "ProjectCampus",
                        principalColumn: "ProjectCampusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeamMembers_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProjectLeaderParticipationMeetings",
                columns: table => new
                {
                    ProjectLeaderParticipationMeetingId = table.Column<string>(nullable: false),
                    Checked = table.Column<bool>(nullable: false),
                    Planned = table.Column<bool>(nullable: false),
                    ProjectLeaderId = table.Column<string>(nullable: true),
                    ProjectMeetingId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectLeaderParticipationMeetings", x => x.ProjectLeaderParticipationMeetingId);
                    table.ForeignKey(
                        name: "FK_ProjectLeaderParticipationMeetings_ProjectLeaders_ProjectLeaderId",
                        column: x => x.ProjectLeaderId,
                        principalTable: "ProjectLeaders",
                        principalColumn: "ProjectLeaderId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectLeaderParticipationMeetings_ProjectMeetings_ProjectMeetingId",
                        column: x => x.ProjectMeetingId,
                        principalTable: "ProjectMeetings",
                        principalColumn: "ProjectMeetingId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Tasks",
                columns: table => new
                {
                    TaskId = table.Column<string>(nullable: false),
                    Accept = table.Column<bool>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    ProjectCampusId = table.Column<string>(nullable: true),
                    ProjectLeaderId = table.Column<string>(nullable: true),
                    Status = table.Column<bool>(nullable: false),
                    TeamMemberId = table.Column<string>(nullable: true),
                    TfsWorkItemId = table.Column<string>(nullable: true),
                    Title = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tasks", x => x.TaskId);
                    table.ForeignKey(
                        name: "FK_Tasks_ProjectCampus_ProjectCampusId",
                        column: x => x.ProjectCampusId,
                        principalTable: "ProjectCampus",
                        principalColumn: "ProjectCampusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Tasks_ProjectLeaders_ProjectLeaderId",
                        column: x => x.ProjectLeaderId,
                        principalTable: "ProjectLeaders",
                        principalColumn: "ProjectLeaderId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Tasks_TeamMembers_TeamMemberId",
                        column: x => x.TeamMemberId,
                        principalTable: "TeamMembers",
                        principalColumn: "TeamMemberId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TeamMemberParticipationMeetings",
                columns: table => new
                {
                    TeamMemberParticipationMeetingId = table.Column<string>(nullable: false),
                    Checked = table.Column<bool>(nullable: false),
                    Planned = table.Column<bool>(nullable: false),
                    ProjectMeetingId = table.Column<string>(nullable: true),
                    TeamMemberId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamMemberParticipationMeetings", x => x.TeamMemberParticipationMeetingId);
                    table.ForeignKey(
                        name: "FK_TeamMemberParticipationMeetings_ProjectMeetings_ProjectMeetingId",
                        column: x => x.ProjectMeetingId,
                        principalTable: "ProjectMeetings",
                        principalColumn: "ProjectMeetingId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeamMemberParticipationMeetings_TeamMembers_TeamMemberId",
                        column: x => x.TeamMemberId,
                        principalTable: "TeamMembers",
                        principalColumn: "TeamMemberId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TeamMemberRatings",
                columns: table => new
                {
                    TeamMemberRatingId = table.Column<string>(nullable: false),
                    Active = table.Column<bool>(nullable: false),
                    ProjectLeaderId = table.Column<string>(nullable: true),
                    TeamMemberId = table.Column<string>(nullable: true),
                    TeamMemberParticipationMeetingId = table.Column<string>(nullable: true),
                    Text = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamMemberRatings", x => x.TeamMemberRatingId);
                    table.ForeignKey(
                        name: "FK_TeamMemberRatings_ProjectLeaders_ProjectLeaderId",
                        column: x => x.ProjectLeaderId,
                        principalTable: "ProjectLeaders",
                        principalColumn: "ProjectLeaderId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeamMemberRatings_TeamMembers_TeamMemberId",
                        column: x => x.TeamMemberId,
                        principalTable: "TeamMembers",
                        principalColumn: "TeamMemberId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TeamMemberRatings_TeamMemberParticipationMeetings_TeamMemberParticipationMeetingId",
                        column: x => x.TeamMemberParticipationMeetingId,
                        principalTable: "TeamMemberParticipationMeetings",
                        principalColumn: "TeamMemberParticipationMeetingId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_CampusEventId",
                table: "AspNetUsers",
                column: "CampusEventId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_UserTypeId",
                table: "AspNetUsers",
                column: "UserTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CampusEvents_CampusId",
                table: "CampusEvents",
                column: "CampusId");

            migrationBuilder.CreateIndex(
                name: "IX_CampusParticipations_CampusId",
                table: "CampusParticipations",
                column: "CampusId");

            migrationBuilder.CreateIndex(
                name: "IX_CampusParticipations_MentorId",
                table: "CampusParticipations",
                column: "MentorId");

            migrationBuilder.CreateIndex(
                name: "IX_CampusParticipations_StudentId",
                table: "CampusParticipations",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_CampusState_CampusId",
                table: "CampusState",
                column: "CampusId");

            migrationBuilder.CreateIndex(
                name: "IX_Mentors_UserId",
                table: "Mentors",
                column: "UserId",
                unique: true,
                filter: "[UserId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCampus_CampusId",
                table: "ProjectCampus",
                column: "CampusId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCampus_ProjectId",
                table: "ProjectCampus",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCampus_ProjectStatusId",
                table: "ProjectCampus",
                column: "ProjectStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCampus_UserId",
                table: "ProjectCampus",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectLeaderParticipationMeetings_ProjectLeaderId",
                table: "ProjectLeaderParticipationMeetings",
                column: "ProjectLeaderId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectLeaderParticipationMeetings_ProjectMeetingId",
                table: "ProjectLeaderParticipationMeetings",
                column: "ProjectMeetingId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectLeaders_MentorId",
                table: "ProjectLeaders",
                column: "MentorId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectLeaders_ProjectCampusId",
                table: "ProjectLeaders",
                column: "ProjectCampusId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMeetings_ProjectCampusId",
                table: "ProjectMeetings",
                column: "ProjectCampusId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentRatings_CampusId",
                table: "StudentRatings",
                column: "CampusId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentRatings_MentorId",
                table: "StudentRatings",
                column: "MentorId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentRatings_StudentId",
                table: "StudentRatings",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_UserId",
                table: "Students",
                column: "UserId",
                unique: true,
                filter: "[UserId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_SubscribedMentors_MentorId",
                table: "SubscribedMentors",
                column: "MentorId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscribedMentors_ProjectCampusId",
                table: "SubscribedMentors",
                column: "ProjectCampusId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscribedStudents_ProjectCampusId",
                table: "SubscribedStudents",
                column: "ProjectCampusId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscribedStudents_StudentId",
                table: "SubscribedStudents",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ProjectCampusId",
                table: "Tasks",
                column: "ProjectCampusId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ProjectLeaderId",
                table: "Tasks",
                column: "ProjectLeaderId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_TeamMemberId",
                table: "Tasks",
                column: "TeamMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMemberParticipationMeetings_ProjectMeetingId",
                table: "TeamMemberParticipationMeetings",
                column: "ProjectMeetingId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMemberParticipationMeetings_TeamMemberId",
                table: "TeamMemberParticipationMeetings",
                column: "TeamMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMemberRatings_ProjectLeaderId",
                table: "TeamMemberRatings",
                column: "ProjectLeaderId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMemberRatings_TeamMemberId",
                table: "TeamMemberRatings",
                column: "TeamMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMemberRatings_TeamMemberParticipationMeetingId",
                table: "TeamMemberRatings",
                column: "TeamMemberParticipationMeetingId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_ProjectCampusId",
                table: "TeamMembers",
                column: "ProjectCampusId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_StudentId",
                table: "TeamMembers",
                column: "StudentId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "CampusParticipations");

            migrationBuilder.DropTable(
                name: "CampusState");

            migrationBuilder.DropTable(
                name: "ProjectLeaderParticipationMeetings");

            migrationBuilder.DropTable(
                name: "ReportResults");

            migrationBuilder.DropTable(
                name: "StudentRatings");

            migrationBuilder.DropTable(
                name: "SubscribedMentors");

            migrationBuilder.DropTable(
                name: "SubscribedStudents");

            migrationBuilder.DropTable(
                name: "Tasks");

            migrationBuilder.DropTable(
                name: "TeamMemberRatings");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "ProjectLeaders");

            migrationBuilder.DropTable(
                name: "TeamMemberParticipationMeetings");

            migrationBuilder.DropTable(
                name: "Mentors");

            migrationBuilder.DropTable(
                name: "ProjectMeetings");

            migrationBuilder.DropTable(
                name: "TeamMembers");

            migrationBuilder.DropTable(
                name: "ProjectCampus");

            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "ProjectStatus");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "CampusEvents");

            migrationBuilder.DropTable(
                name: "UserType");

            migrationBuilder.DropTable(
                name: "Campus");
        }
    }
}
