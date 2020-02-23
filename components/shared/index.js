export function profileName(profile, did) {
    return (profile && profile.name) || `Unknown #${did.slice(-6)}`
}