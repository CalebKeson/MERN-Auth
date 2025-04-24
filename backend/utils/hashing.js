import { hashSync} from 'bcryptjs';

export const doHash = (value, salt) => {
    const result = hashSync(value, salt)
    return result
}