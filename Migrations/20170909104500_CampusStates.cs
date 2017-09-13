using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace EvoManager.Migrations
{
    public partial class CampusStates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CampusParticipation_Campus_CampusId",
                table: "CampusParticipation");

            migrationBuilder.DropForeignKey(
                name: "FK_CampusParticipation_Mentors_MentorId",
                table: "CampusParticipation");

            migrationBuilder.DropForeignKey(
                name: "FK_CampusParticipation_Students_StudentId",
                table: "CampusParticipation");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CampusParticipation",
                table: "CampusParticipation");

            migrationBuilder.DropColumn(
                name: "Active",
                table: "Campus");

            migrationBuilder.RenameTable(
                name: "CampusParticipation",
                newName: "CampusParticipations");

            migrationBuilder.RenameIndex(
                name: "IX_CampusParticipation_StudentId",
                table: "CampusParticipations",
                newName: "IX_CampusParticipations_StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_CampusParticipation_MentorId",
                table: "CampusParticipations",
                newName: "IX_CampusParticipations_MentorId");

            migrationBuilder.RenameIndex(
                name: "IX_CampusParticipation_CampusId",
                table: "CampusParticipations",
                newName: "IX_CampusParticipations_CampusId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CampusParticipations",
                table: "CampusParticipations",
                column: "CampusParticipationId");

            migrationBuilder.CreateTable(
                name: "CampusState",
                columns: table => new
                {
                    CampusStateId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CampusId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CampusStateValue = table.Column<int>(type: "int", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false)
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

            migrationBuilder.CreateIndex(
                name: "IX_CampusState_CampusId",
                table: "CampusState",
                column: "CampusId");

            migrationBuilder.AddForeignKey(
                name: "FK_CampusParticipations_Campus_CampusId",
                table: "CampusParticipations",
                column: "CampusId",
                principalTable: "Campus",
                principalColumn: "CampusId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CampusParticipations_Mentors_MentorId",
                table: "CampusParticipations",
                column: "MentorId",
                principalTable: "Mentors",
                principalColumn: "MentorId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CampusParticipations_Students_StudentId",
                table: "CampusParticipations",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "StudentId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CampusParticipations_Campus_CampusId",
                table: "CampusParticipations");

            migrationBuilder.DropForeignKey(
                name: "FK_CampusParticipations_Mentors_MentorId",
                table: "CampusParticipations");

            migrationBuilder.DropForeignKey(
                name: "FK_CampusParticipations_Students_StudentId",
                table: "CampusParticipations");

            migrationBuilder.DropTable(
                name: "CampusState");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CampusParticipations",
                table: "CampusParticipations");

            migrationBuilder.RenameTable(
                name: "CampusParticipations",
                newName: "CampusParticipation");

            migrationBuilder.RenameIndex(
                name: "IX_CampusParticipations_StudentId",
                table: "CampusParticipation",
                newName: "IX_CampusParticipation_StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_CampusParticipations_MentorId",
                table: "CampusParticipation",
                newName: "IX_CampusParticipation_MentorId");

            migrationBuilder.RenameIndex(
                name: "IX_CampusParticipations_CampusId",
                table: "CampusParticipation",
                newName: "IX_CampusParticipation_CampusId");

            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "Campus",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_CampusParticipation",
                table: "CampusParticipation",
                column: "CampusParticipationId");

            migrationBuilder.AddForeignKey(
                name: "FK_CampusParticipation_Campus_CampusId",
                table: "CampusParticipation",
                column: "CampusId",
                principalTable: "Campus",
                principalColumn: "CampusId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CampusParticipation_Mentors_MentorId",
                table: "CampusParticipation",
                column: "MentorId",
                principalTable: "Mentors",
                principalColumn: "MentorId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CampusParticipation_Students_StudentId",
                table: "CampusParticipation",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "StudentId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
