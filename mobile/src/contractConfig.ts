import { CONTRACT_ADDRESS as ENV_CONTRACT_ADDRESS } from '@env';

function parseAddress(raw: string | undefined): `0x${string}` | undefined {
    if (!raw || typeof raw !== 'string') {
        return undefined;
    }
    const t = raw.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(t)) {
        return undefined;
    }
    return t as `0x${string}`;
}

export const CONTRACT_ADDRESS = parseAddress(ENV_CONTRACT_ADDRESS);

export const isContractConfigured = CONTRACT_ADDRESS !== undefined;
