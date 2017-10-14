using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace EvoManager.Migrations
{
    public partial class one_project_to_more_campus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectLeaders_Projects_ProjectId",
                table: "ProjectLeaders");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectMeetings_Projects_ProjectId",
                table: "ProjectMeetings");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Campus_CampusId",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Mentors_MentorId",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_ProjectStatus_ProjectStatusId",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Students_StudentId",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_AspNetUsers_UserId",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_SubscribedMentors_Projects_ProjectId",
                table: "SubscribedMentors");

            migrationBuilder.DropForeignKey(
                name: "FK_SubscribedStudents_Projects_ProjectId",
                table: "SubscribedStudents");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Projects_ProjectId",
                table: "Tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamMembers_Projects_ProjectId",
                table: "TeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_TeamMembers_ProjectId",
                table: "TeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_ProjectId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_SubscribedStudents_ProjectId",
                table: "SubscribedStudents");

            migrationBuilder.DropIndex(
                name: "IX_SubscribedMentors_ProjectId",
                table: "SubscribedMentors");

            migrationBuilder.DropIndex(
                name: "IX_Projects_CampusId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_MentorId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_ProjectStatusId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_StudentId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_UserId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_ProjectMeetings_ProjectId",
                table: "ProjectMeetings");

            migrationBuilder.DropIndex(
                name: "IX_ProjectLeaders_ProjectId",
                table: "ProjectLeaders");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "TeamMembers");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "SubscribedStudents");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "SubscribedMentors");

            migrationBuilder.DropColumn(
                name: "CampusId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "MentorId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ProjectStatusId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "TfsProjectName",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "TfsProjectURL",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "ProjectMeetings");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "ProjectLeaders");

            migrationBuilder.AddColumn<string>(
                name: "ProjectCampusId",
                table: "TeamMembers",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectCampusId",
                table: "Tasks",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectCampusId",
                table: "SubscribedStudents",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectCampusId",
                table: "SubscribedMentors",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectCampusId",
                table: "ProjectMeetings",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectCampusId",
                table: "ProjectLeaders",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProjectCampus",
                columns: table => new
                {
                    ProjectCampusId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CampusId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ProjectId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ProjectStatusId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    TfsProjectName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TfsProjectURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
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

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_ProjectCampusId",
                table: "TeamMembers",
                column: "ProjectCampusId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ProjectCampusId",
                table: "Tasks",
                column: "ProjectCampusId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscribedStudents_ProjectCampusId",
                table: "SubscribedStudents",
                column: "ProjectCampusId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscribedMentors_ProjectCampusId",
                table: "SubscribedMentors",
                column: "ProjectCampusId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMeetings_ProjectCampusId",
                table: "ProjectMeetings",
                column: "ProjectCampusId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectLeaders_ProjectCampusId",
                table: "ProjectLeaders",
                column: "ProjectCampusId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectLeaders_ProjectCampus_ProjectCampusId",
                table: "ProjectLeaders",
                column: "ProjectCampusId",
                principalTable: "ProjectCampus",
                principalColumn: "ProjectCampusId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectMeetings_ProjectCampus_ProjectCampusId",
                table: "ProjectMeetings",
                column: "ProjectCampusId",
                principalTable: "ProjectCampus",
                principalColumn: "ProjectCampusId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SubscribedMentors_ProjectCampus_ProjectCampusId",
                table: "SubscribedMentors",
                column: "ProjectCampusId",
                principalTable: "ProjectCampus",
                principalColumn: "ProjectCampusId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SubscribedStudents_ProjectCampus_ProjectCampusId",
                table: "SubscribedStudents",
                column: "ProjectCampusId",
                principalTable: "ProjectCampus",
                principalColumn: "ProjectCampusId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_ProjectCampus_ProjectCampusId",
                table: "Tasks",
                column: "ProjectCampusId",
                principalTable: "ProjectCampus",
                principalColumn: "ProjectCampusId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMembers_ProjectCampus_ProjectCampusId",
                table: "TeamMembers",
                column: "ProjectCampusId",
                principalTable: "ProjectCampus",
                principalColumn: "ProjectCampusId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectLeaders_ProjectCampus_ProjectCampusId",
                table: "ProjectLeaders");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectMeetings_ProjectCampus_ProjectCampusId",
                table: "ProjectMeetings");

            migrationBuilder.DropForeignKey(
                name: "FK_SubscribedMentors_ProjectCampus_ProjectCampusId",
                table: "SubscribedMentors");

            migrationBuilder.DropForeignKey(
                name: "FK_SubscribedStudents_ProjectCampus_ProjectCampusId",
                table: "SubscribedStudents");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_ProjectCampus_ProjectCampusId",
                table: "Tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamMembers_ProjectCampus_ProjectCampusId",
                table: "TeamMembers");

            migrationBuilder.DropTable(
                name: "ProjectCampus");

            migrationBuilder.DropIndex(
                name: "IX_TeamMembers_ProjectCampusId",
                table: "TeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_ProjectCampusId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_SubscribedStudents_ProjectCampusId",
                table: "SubscribedStudents");

            migrationBuilder.DropIndex(
                name: "IX_SubscribedMentors_ProjectCampusId",
                table: "SubscribedMentors");

            migrationBuilder.DropIndex(
                name: "IX_ProjectMeetings_ProjectCampusId",
                table: "ProjectMeetings");

            migrationBuilder.DropIndex(
                name: "IX_ProjectLeaders_ProjectCampusId",
                table: "ProjectLeaders");

            migrationBuilder.DropColumn(
                name: "ProjectCampusId",
                table: "TeamMembers");

            migrationBuilder.DropColumn(
                name: "ProjectCampusId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "ProjectCampusId",
                table: "SubscribedStudents");

            migrationBuilder.DropColumn(
                name: "ProjectCampusId",
                table: "SubscribedMentors");

            migrationBuilder.DropColumn(
                name: "ProjectCampusId",
                table: "ProjectMeetings");

            migrationBuilder.DropColumn(
                name: "ProjectCampusId",
                table: "ProjectLeaders");

            migrationBuilder.AddColumn<string>(
                name: "ProjectId",
                table: "TeamMembers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectId",
                table: "Tasks",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectId",
                table: "SubscribedStudents",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectId",
                table: "SubscribedMentors",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CampusId",
                table: "Projects",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MentorId",
                table: "Projects",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectStatusId",
                table: "Projects",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudentId",
                table: "Projects",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TfsProjectName",
                table: "Projects",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TfsProjectURL",
                table: "Projects",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Projects",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectId",
                table: "ProjectMeetings",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectId",
                table: "ProjectLeaders",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_ProjectId",
                table: "TeamMembers",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ProjectId",
                table: "Tasks",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscribedStudents_ProjectId",
                table: "SubscribedStudents",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscribedMentors_ProjectId",
                table: "SubscribedMentors",
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
                name: "IX_ProjectMeetings_ProjectId",
                table: "ProjectMeetings",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectLeaders_ProjectId",
                table: "ProjectLeaders",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectLeaders_Projects_ProjectId",
                table: "ProjectLeaders",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "ProjectId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectMeetings_Projects_ProjectId",
                table: "ProjectMeetings",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "ProjectId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Campus_CampusId",
                table: "Projects",
                column: "CampusId",
                principalTable: "Campus",
                principalColumn: "CampusId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Mentors_MentorId",
                table: "Projects",
                column: "MentorId",
                principalTable: "Mentors",
                principalColumn: "MentorId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_ProjectStatus_ProjectStatusId",
                table: "Projects",
                column: "ProjectStatusId",
                principalTable: "ProjectStatus",
                principalColumn: "ProjectStatusId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Students_StudentId",
                table: "Projects",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "StudentId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_AspNetUsers_UserId",
                table: "Projects",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SubscribedMentors_Projects_ProjectId",
                table: "SubscribedMentors",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "ProjectId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SubscribedStudents_Projects_ProjectId",
                table: "SubscribedStudents",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "ProjectId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Projects_ProjectId",
                table: "Tasks",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "ProjectId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamMembers_Projects_ProjectId",
                table: "TeamMembers",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "ProjectId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
