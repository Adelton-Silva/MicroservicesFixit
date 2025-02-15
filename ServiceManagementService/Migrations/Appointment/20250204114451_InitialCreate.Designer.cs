﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using ServiceManagementService.Data;

#nullable disable

namespace ServiceManagementService.Migrations.Appointment
{
    [DbContext(typeof(AppointmentContext))]
    [Migration("20250204114451_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ServiceManagementService.Models.Appointment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("Client_id")
                        .HasColumnType("integer")
                        .HasColumnName("client_id");

                    b.Property<DateTime?>("Created_date")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_date");

                    b.Property<DateOnly?>("Date_appointment")
                        .HasColumnType("date")
                        .HasColumnName("date_appointment");

                    b.Property<DateOnly?>("Date_conclusion")
                        .HasColumnType("date")
                        .HasColumnName("date_conclusion");

                    b.Property<int?>("Machine_id")
                        .HasColumnType("integer")
                        .HasColumnName("machine_id");

                    b.Property<DateTime?>("Modified_date")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("modified_date");

                    b.Property<int?>("Status_id")
                        .HasColumnType("integer")
                        .HasColumnName("status_id");

                    b.HasKey("Id");

                    b.ToTable("appointments");
                });
#pragma warning restore 612, 618
        }
    }
}
