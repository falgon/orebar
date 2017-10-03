interface DnsError {
    Error: Error;
    code: string;
    errno: string;
    syscall: string;
    hostname: string;
    host: string;
    port: number;
}
