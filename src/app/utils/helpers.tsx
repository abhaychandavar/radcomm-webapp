import Image from "next/image"

class helpers {
    static getFlagIcon = (countryCode: string) => {
        return <Image
        height={16}
        width={16}
        alt={countryCode}
        src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`}/>
    }
}

export default helpers;