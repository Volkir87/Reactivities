using FluentValidation;

namespace Application.Validators
{
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> rulebuilder) 
        {
            var options = rulebuilder
            .NotEmpty()
            .MinimumLength(6).WithMessage("The password must be minimum 6 characters long")
            .Matches("[A-Z]").WithMessage("The password must contain at least one uppercase letter")
            .Matches("[a-z]").WithMessage("The password must contain at least one lowercase letter")
            .Matches("[0-9]").WithMessage("The password must contain at least one number")
            .Matches("[^a-zA-Z0-9]").WithMessage("The password must contain at least one non alphanumeric character");

            return options;
        }
    }
}