/**
 * The Talim sign-in look as presentational components (Tailwind only, no app
 * hooks), shared by Teachers, Students and Parents. See docs/signin-ui.md.
 */
export { SignInShell, SignInFooter, type SignInShellProps, type SignInFooterProps } from "./SignInShell";
export { SignInLogoHeader, SignInHeading, type SignInLogoHeaderProps, type SignInHeadingProps } from "./SignInHeader";
export {
  SignInField,
  SignInPasswordField,
  SignInCheckbox,
  SignInOptionsRow,
  type SignInFieldProps,
  type SignInPasswordFieldProps,
  type SignInCheckboxProps,
} from "./SignInField";
export { SignInErrorBanner, type SignInErrorBannerProps, type SignInErrorTone } from "./SignInErrorBanner";
export { SignInPrimaryButton, type SignInPrimaryButtonProps } from "./SignInPrimaryButton";
export { signInDescribedBy, signInInputClass, signInLabelClass, signInLinkClass, signInInlineLinkClass } from "./classes";
