using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace EvoManager.Migrations
{
    public partial class DeletedSubscribes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "SubscribedStudents",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "SubscribedMentors",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "SubscribedStudents");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "SubscribedMentors");
        }
    }
}
