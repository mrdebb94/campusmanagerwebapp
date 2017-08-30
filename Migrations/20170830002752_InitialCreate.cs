using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace EvoManager.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Campus",
                columns: table => new
                {
                    CampusId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Campus", x => x.CampusId);
                });

            migrationBuilder.CreateTable(
                name: "ProjectStatus",
                columns: table => new
                {
                    ProjectStatusId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectStatus", x => x.ProjectStatusId);
                });

            migrationBuilder.CreateTable(
                name: "UserType",
                columns: table => new
                {
                    UserTypeId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserType", x => x.UserTypeId);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
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
                    CampusEventId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CampusId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsCancelled = table.Column<bool>(type: "bit", nullable: false),
                    Room = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false),
                    CampusEventId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    MentorId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    UserTypeId = table.Column<string>(type: "nvarchar(450)", nullable: true)
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
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
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
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
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
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
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
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                    MentorId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
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
                name: "Students",
                columns: table => new
                {
                    StudentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    HasScholarship = table.Column<bool>(type: "bit", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
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
                name: "CampusParticipation",
                columns: table => new
                {
                    CampusParticipationId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CampusId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    MentorId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    StudentId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CampusParticipation", x => x.CampusParticipationId);
                    table.ForeignKey(
                        name: "FK_CampusParticipation_Campus_CampusId",
                        column: x => x.CampusId,
                        principalTable: "Campus",
                        principalColumn: "CampusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CampusParticipation_Mentors_MentorId",
                        column: x => x.MentorId,
                        principalTable: "Mentors",
                        principalColumn: "MentorId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CampusParticipation_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    ProjectId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CampusId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MentorId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectStatusId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    StudentId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    TfsProjectName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TfsProjectURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.ProjectId);
                    table.ForeignKey(
                        name: "FK_Projects_Campus_CampusId",
                        column: x => x.CampusId,
                        principalTable: "Campus",
                        principalColumn: "CampusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Projects_Mentors_MentorId",
                        column: x => x.MentorId,
                        principalTable: "Mentors",
                        principalColumn: "MentorId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Projects_ProjectStatus_ProjectStatusId",
                        column: x => x.ProjectStatusId,
                        principalTable: "ProjectStatus",
                        principalColumn: "ProjectStatusId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Projects_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Projects_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "StudentRatings",
                columns: table => new
                {
                    StudentRatingId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    CampusId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    MentorId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    StudentId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                name: "ProjectLeaders",
                columns: table => new
                {
                    ProjectLeaderId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MentorId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ProjectId = table.Column<string>(type: "nvarchar(450)", nullable: true)
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
                        name: "FK_ProjectLeaders_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProjectMeetings",
                columns: table => new
                {
                    ProjectMeetingId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsCancelled = table.Column<bool>(type: "bit", nullable: false),
                    ProjectId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Room = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectMeetings", x => x.ProjectMeetingId);
                    table.ForeignKey(
                        name: "FK_ProjectMeetings_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SubscribedMentors",
                columns: table => new
                {
                    SubscribedMentorId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MentorId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ProjectId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    SubscribedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
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
                        name: "FK_SubscribedMentors_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SubscribedStudents",
                columns: table => new
                {
                    SubscribedStudentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProjectId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    StudentId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    SubscribedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubscribedStudents", x => x.SubscribedStudentId);
                    table.ForeignKey(
                        name: "FK_SubscribedStudents_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
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
                    TeamMemberId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    JoinDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProjectId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    StudentId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamMembers", x => x.TeamMemberId);
                    table.ForeignKey(
                        name: "FK_TeamMembers_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
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
                    ProjectLeaderParticipationMeetingId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Checked = table.Column<bool>(type: "bit", nullable: false),
                    Planned = table.Column<bool>(type: "bit", nullable: false),
                    ProjectLeaderId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ProjectMeetingId = table.Column<string>(type: "nvarchar(450)", nullable: true)
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
                    TaskId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Accept = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    TeamMemberId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    TfsWorkItemId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tasks", x => x.TaskId);
                    table.ForeignKey(
                        name: "FK_Tasks_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
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
                    TeamMemberParticipationMeetingId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Checked = table.Column<bool>(type: "bit", nullable: false),
                    Planned = table.Column<bool>(type: "bit", nullable: false),
                    ProjectMeetingId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    TeamMemberId = table.Column<string>(type: "nvarchar(450)", nullable: true)
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
                    TeamMemberRatingId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    ProjectLeaderId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    TeamMemberId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    TeamMemberParticipationMeetingId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                name: "IX_CampusParticipation_CampusId",
                table: "CampusParticipation",
                column: "CampusId");

            migrationBuilder.CreateIndex(
                name: "IX_CampusParticipation_MentorId",
                table: "CampusParticipation",
                column: "MentorId");

            migrationBuilder.CreateIndex(
                name: "IX_CampusParticipation_StudentId",
                table: "CampusParticipation",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Mentors_UserId",
                table: "Mentors",
                column: "UserId",
                unique: true,
                filter: "[UserId] IS NOT NULL");

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
                name: "IX_ProjectLeaders_ProjectId",
                table: "ProjectLeaders",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMeetings_ProjectId",
                table: "ProjectMeetings",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_CampusId",
                table: "Projects",
                column: "CampusId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_MentorId",
                table: "Projects",
                column: "MentorId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ProjectStatusId",
                table: "Projects",
                column: "ProjectStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_StudentId",
                table: "Projects",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_UserId",
                table: "Projects",
                column: "UserId");

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
                name: "IX_SubscribedMentors_ProjectId",
                table: "SubscribedMentors",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscribedStudents_ProjectId",
                table: "SubscribedStudents",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscribedStudents_StudentId",
                table: "SubscribedStudents",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ProjectId",
                table: "Tasks",
                column: "ProjectId");

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
                name: "IX_TeamMembers_ProjectId",
                table: "TeamMembers",
                column: "ProjectId");

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
                name: "CampusParticipation");

            migrationBuilder.DropTable(
                name: "ProjectLeaderParticipationMeetings");

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
                name: "ProjectMeetings");

            migrationBuilder.DropTable(
                name: "TeamMembers");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "Mentors");

            migrationBuilder.DropTable(
                name: "ProjectStatus");

            migrationBuilder.DropTable(
                name: "Students");

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
