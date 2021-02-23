using System.Threading.Tasks;
using Application.User;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    
    public class UserController : BaseController 
    {
        [AllowAnonymous] // this is to override authorization policy, so that users can login
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(Login.Query query) 
        {
            return await Mediator.Send(query);
        }

        [AllowAnonymous] // this is to override authorization policy, so that users can login
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(Register.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet]
        public async Task<ActionResult<User>> CurrentUser() 
        {
            return await Mediator.Send(new CurrentUser.Query());
        }
    }
}