export class GlobalConstants {
    //error message
    public static genericError: string = "Something went wront. Please try again later";

    public static unauthorized: string = "You are not authorized to access this page"

    // Regex
    public static nameRegex: string = "[a-zA-Z0-9 ]*";

    public static emailRegex: string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";

    public static contactNumberRegex: string = "^[e0-9]{10,10}$";

    public static salaryRegex: string = "^[0-9]+$";

    //variables
    public static error: string = "error";
}