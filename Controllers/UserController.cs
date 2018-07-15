using System;
using System.Collections.Generic;
using System.Linq;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Security.Claims;
using EvoManager.Models;
using EvoManager.ViewModels;
using EvoManager.Utils;
using Serilog;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Antiforgery;

namespace EvoManager.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UserController : Controller
    {

        private EvoDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IAntiforgery _antiForgeryService;
        private readonly IUserClaimsPrincipalFactory<User> _userClaimsPrincipalFactory;

        public UserController(EvoDbContext context, UserManager<User> userManager,
            SignInManager<User> signInManager, RoleManager<IdentityRole> roleManager,
            IAntiforgery antiForgeryService, IUserClaimsPrincipalFactory<User> userClaimsPrincipalFactory)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _antiForgeryService = antiForgeryService;
            _userClaimsPrincipalFactory = userClaimsPrincipalFactory;

        }

        [AllowAnonymous]
        [HttpGet("[action]")]
        public async Task<IEnumerable<UserViewModel>> List()
        {

            Log.Information("Supporting role " + _userManager.SupportsUserRole);

            List<UserViewModel> resultUsers = new List<UserViewModel>();

            foreach (var user in _context.Users)
            {
                IList<String> roles = await _userManager.GetRolesAsync(user);

                resultUsers.Add(new UserViewModel
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    Name = user.Name,
                    Password = user.PasswordHash,
                    Email = user.Email,
                    Type = (roles.Count > 0 ? roles[0] : "")
                });
            }

            /*var tokens =  _antiForgeryService.GetAndStoreTokens(this.HttpContext);
            this.HttpContext.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, 
                             new CookieOptions() { HttpOnly = false });
            Log.Information("New Token " + tokens.RequestToken);*/

            return resultUsers;

        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> LogIn([FromBody][Bind("UserName", "Password")] UserViewModel userModel)
        {
            var result = await _signInManager.PasswordSignInAsync(userModel.UserName,
            userModel.Password, false, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                //var user =  _context.Users.FirstOrDefault(m=>m.UserName == userModel.Name);
                //HttpContext.User = await _userClaimsPrincipalFactory.CreateAsync(user);
                //var tokens =  _antiForgeryService.GetAndStoreTokens(this.HttpContext);
                Log.Information("Belepes: " + this.User.Identity.IsAuthenticated);
                //Log.Information("Token by login: " +  tokens.RequestToken);
                //var tokens =  _antiForgeryService.GetAndStoreTokens(this.HttpContext);
                /*var tokens =_antiForgeryService.GetAndStoreTokens(this.HttpContext);
                this.HttpContext.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, 
                        new CookieOptions() { HttpOnly = false });
                Log.Information("New Token LOGIN" + tokens.RequestToken);
				*/
                var user = _context.Users.FirstOrDefault(m => m.UserName == userModel.UserName);
                IList<String> roles = await _userManager.GetRolesAsync(user);
                return Ok(Json(new { roles, Id = user.Id }));
            }
            else
            {

                return NotFound();
            }
        }


        [AllowAnonymous]
        [HttpPost("[action]")]
        [ValidateAntiForgeryToken]
        public async Task<JSendResponseType<UserForm>> Add([FromBody][Bind("UserName", "Name", "Password","Email", "Type")]
                              UserViewModel userModel)
        {

            JSendResponseType<UserForm> formResult = new JSendResponseType<UserForm>
            {
                Status = "success"
            };

            /*TODO:KELL!!!!
            //mezei reigsztrációkor csak User jogú felhasználót lehet létrehozni
            if(!this.User.Identity.IsAuthenticated) 
            {
                userModel.Type="User";
            }
            */

            Log.Information("Hozzaadas: " + this.User.Identity.IsAuthenticated);

            User user = new User { Name = userModel.Name, UserName = userModel.UserName, Email = userModel.Email };
            var result = await _userManager.CreateAsync(user, userModel.Password);
            if (result.Succeeded)
            {

                bool existsRole = await _roleManager.RoleExistsAsync(userModel.Type);

                if (!existsRole)
                {
                    var role = new IdentityRole();
                    role.Name = userModel.Type;
                    await _roleManager.CreateAsync(role);
                    //TODO szereptől függő plusz adat??
                }

                await _userManager.AddToRoleAsync(user, userModel.Type);
                //await _signInManager.SignInAsync(user, isPersistent: false);
                //Lob.Information("User created a new account with password.");
                formResult.Status = "success";

                return formResult;
            }
            else
            {
                formResult.Status = "fail";
                formResult.Data = new UserForm();

                foreach (var error in result.Errors)
                {
                    Log.Information(error.Code + " " + error.Description);

                    if (error.Code == "InvalidUserName")
                    {
                        formResult.Data.UserName += "Felhasználónévnek tartalmaznia kell betűt és számot.";
                    }

                    if (error.Code == "DuplicateUserName")
                    {
                        formResult.Data.UserName += "Ez a felhasználónév már foglalt.";
                    }

                    /*<data name="PasswordMismatch" xml:space="preserve">
                        <value>Incorrect password.</value>
                        <comment>Error when a password doesn't match</comment>
                      </data>
                      <data name="PasswordRequiresDigit" xml:space="preserve">
                        <value>Passwords must have at least one digit ('0'-'9').</value>
                        <comment>Error when passwords do not have a digit</comment>
                      </data>
                      <data name="PasswordRequiresLower" xml:space="preserve">
                        <value>Passwords must have at least one lowercase ('a'-'z').</value>
                        <comment>Error when passwords do not have a lowercase letter</comment>
                      </data>
                      <data name="PasswordRequiresNonAlphanumeric" xml:space="preserve">
                        <value>Passwords must have at least one non alphanumeric character.</value>
                        <comment>Error when password does not have enough non alphanumeric characters</comment>
                      </data>
                      <data name="PasswordRequiresUpper" xml:space="preserve">
                        <value>Passwords must have at least one uppercase ('A'-'Z').</value>
                        <comment>Error when passwords do not have an uppercase letter</comment>
                      </data>
                      <data name="PasswordTooShort" xml:space="preserve">
                        <value>Passwords must be at least {0} characters.</value>
                        <comment>Error message for passwords that are too short</comment>
                      </data>
                      <data name="PasswordRequiresUniqueChars" xml:space="preserve">
                        <value>Passwords must use at least {0} different characters.</value>
                        <comment>Error message for passwords that are based on similar characters</comment>
                      </data>
                      */

                    if (error.Code == "PasswordTooShort")
                    {
                        formResult.Data.Password += "A jelszónak legalább 4 karakterből kell állnia.";
                    }

                    if (error.Code == "PasswordRequiresUniqueChars")
                    {
                        formResult.Data.Password += "Különböző karakterek száma legalább 1 legyen.";
                    }
                    if (error.Code == "InvalidEmail")
                    {
                        formResult.Data.Email += "Az e-mail formátuma nem megfelelő.";
                    }

                    if (error.Code == "DuplicateEmail")
                    {
                        formResult.Data.Email += "Ilyen e-mail címmel már van bejegyezve felhasználó.";
                    }
                }

                return formResult;

            }

            return formResult;

        }

        [HttpPost("[action]")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> LogOut()
        {
            await _signInManager.SignOutAsync();
            //var tokens =  _antiForgeryService.GetAndStoreTokens(this.HttpContext);
            Log.Information("Kilepes: " + this.User.Identity.IsAuthenticated);
            /*var tokens =_antiForgeryService.GetAndStoreTokens(this.HttpContext);
                   this.HttpContext.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, 
                           new CookieOptions() { HttpOnly = false });

                   Log.Information("New Token LOGOUT" + tokens.RequestToken);*/
            return Ok();
        }
    }
}