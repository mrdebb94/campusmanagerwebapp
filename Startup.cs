using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using EvoManager.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.NodeServices;

using Serilog;

namespace EvoManager
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;
			
			 Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .WriteTo.LiterateConsole()
                .WriteTo.RollingFile("logs\\myapp.txt")
                .CreateLogger();

        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
			Log.Information(Configuration.GetConnectionString("DefaultConnection"));
			
			services.AddDbContext<EvoDbContext>(options =>
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentity<User, IdentityRole>()
                .AddEntityFrameworkStores<EvoDbContext>()
                .AddDefaultTokenProviders();
                
            services.AddAntiforgery(x => x.HeaderName = "X-XSRF-TOKEN");
            //services.AddAntiforgery(opts => opts.Cookie.Name = "MyAntiforgeryCookie");
            services.AddMvc();
			
			//node.js service because of pdf generator
			services.AddNodeServices(
			  options=> {
				  options.InvocationTimeoutMilliseconds=120000;
			  });

            // Configure Identity
            services.Configure<IdentityOptions>(options =>
            {
                // Password settings
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 4;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env,  IAntiforgery antiforgery)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            //app.UseResponseCaching();

            app.UseAuthentication();

            app.Use(next => context =>
            {
                string path = context.Request.Path.Value;
                Log.Information("Path " + path);
                if (
                    string.Equals(path, "/", StringComparison.OrdinalIgnoreCase) 
                   || string.Equals(path, "/index.html", StringComparison.OrdinalIgnoreCase)
                   //|| string.Equals(path, "/api/user/logout", StringComparison.OrdinalIgnoreCase)
                )
                {
                    // We can send the request token as a JavaScript-readable cookie, 
                    // and Angular will use it by default.
                    //Log.Information("New Token " + tokens.RequestToken);
                    var tokens = antiforgery.GetAndStoreTokens(context);
                    context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, 
                        new CookieOptions() { HttpOnly = false });

                    Log.Information("New Token " + tokens.RequestToken);
                                                
                }

                return next(context);
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}
