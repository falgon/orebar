import { productName } from '../../../../package.json';
import { bugs } from '../../../../package.json';

export function dnsError(code: string) {
    let errorMessage: string[] = [];
    switch (code) {
        case 'ECONNREFUSED':
        case 'ETIMEOUT':
        case 'ENOTFOUND': {
            errorMessage.push('DNS Error: Colud not resolve the the hostname.');
            errorMessage.push('Possible reasons: offline');
            break;
        }
        case 'ENODATA': {
            errorMessage.push('DNS Error: DNS server returned answer with no data.');
            errorMessage.push('Sorry, please try again.');
            break;
        }
        case 'EFORMERR': {
            errorMessage.push('DNS Error: DNS server claims query was misformatted.');
            errorMessage.push('Sorry, please submit a bug report: Nodejs dns');
            break;
        }
        case 'ESERVFAIL': {
            errorMessage.push('DNS Error: DNS server returned general failure.');
            errorMessage.push('Sorry, please try again.');
            break;
        }
        case 'ENOTIMP': {
            errorMessage.push('DNS Error: DNS server does not implement requested operation.');
            errorMessage.push('Sorry, please try again after change the DNS servers.');
            break;
        }
        case 'EREFUSED': {
            errorMessage.push('DNS Error: DNS server refused query.');
            errorMessage.push('Sorry, please try again or change the DNS servers.');
            break;
        }
        case 'EBADQUERY': {
            errorMessage.push('DNS Error: Misformatted DNS query.');
            errorMessage.push('Sorry, please try again or change the DNS servers.');
            break;
        }
        case 'EBADNAME': {
            errorMessage.push('DNS Error: Misformatted hostname.');
            errorMessage.push('Sorry, please try again or change the DNS servers.');
            break;
        }
        case 'EBADFAMILY': {
            errorMessage.push('DNS Error: Unsupported address family.');
            errorMessage.push('Sorry, please try again or change the DNS servers.');
            break;
        }
        case 'EBADRESP': {
            errorMessage.push('DNS Error: Misformatted DNS reply.');
            errorMessage.push('Sorry, please try again or change the DNS servers.');
            break;
        }
        case 'EEOF': {
            errorMessage.push('DNS Error: End of file.');
            errorMessage.push('Sorry, please try again or change the DNS servers.');
            break;
        }
        case 'EFILE': {
            errorMessage.push('DNS Error: Error reading file.');
            errorMessage.push('Sorry, please try again or change the DNS servers.');
            break;
        }
        case 'ENOMEM': {
            errorMessage.push('DNS internal error: Out of memory.');
            errorMessage.push('Sorry, please submit a bug report: Nodejs dns');
            break;
        }
        case 'EDESTRUCTION': {
            errorMessage.push('DNS internal error: Channel is being destroyed.');
            errorMessage.push('Sorry, please submit a bug report: Nodejs dns');
            break;
        }
        case 'EBADSTR': {
            errorMessage.push('DNS internal error: Misformatted string.');
            errorMessage.push('Sorry, please submit a bug report: Nodejs dns');
            break;
        }
        case 'EBADFLAGS': {
            errorMessage.push('DNS internal error: Illegal flags specified.');
            errorMessage.push('Sorry, please submit a bug report: Nodejs dns');
            break;
        }
        case 'ENONAME': {
            errorMessage.push('DNS internal error: Given hostname is not numeric.');
            errorMessage.push('Sorry, please submit a bug report: Nodejs dns');
            break;
        }
        case 'EBADHINTS': {
            errorMessage.push('DNS internal error: Illegal hints flags specified.');
            errorMessage.push('Sorry, please submit a bug report: Nodejs dns');
            break;
        }
        case 'ENOTINITIALIZED': {
            errorMessage.push('DNS internal error:  c-ares library initialization not yet performed.');
            errorMessage.push('Sorry, please submit a bug report: Nodejs dns');
            break;
        }
        case 'ELOADIPHLPAPI': {
            errorMessage.push('DNS internal error: Error loading iphlpapi.dll.');
            errorMessage.push('Sorry, please install' + productName + ' again or submit a bug report: Nodejs dns');
            break;
        }
        case 'EADDRGETNETWORKPARAMS': {
            errorMessage.push('DNS internal error: Could not find GetNetworkParams function.');
            errorMessage.push('Sorry, this system is not supported.');
            break;
        }
        case 'CANCELLED': {
            errorMessage.push('DNS error: DNS query cancelled.');
            errorMessage.push('Sorry, please submit a bug report ' + bugs.url);
            break;
        }
        default: {
            errorMessage.push('Unknown Error.');
            errorMessage.push('Sorry, please submit a bug report:' + bugs.url);
            break;
        }
    }
    return errorMessage;
}
