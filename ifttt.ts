/*******************************************************************************
 * Functions for IFTTT
 *
 * Company: 
 * Website: 
 * Email:   
 *******************************************************************************/

// IFTTT API url.
const IFTTT_API_URL = "maker.ifttt.com"

namespace esp8266 {
    // Flag to indicate whether the data was uploaded to ThingSpeak successfully.
    let IFTTTsent = false



    /**
     * Return true if data is uploaded to ThingSpeak successfully.
     */
    //% subcategory="IFTTT"
    //% weight=30
    //% blockGap=8
    //% blockId=esp8266_is_ifttt_data_sent
    //% block="IFTTT data sent"
    export function isIFTTTsent(): boolean {
        return IFTTTsent
    }


    //% subcategory="IFTTT"
    //% weight=29
    //% blockGap=8
    //% blockId=esp8266_trigger_IFTTT
    //% block="Trigger IFTTT Event Name %eventname Key %key Value 1 %value1 Value 2 %value2 Value 3 %value3"
    export function triggerIFTTT(eventname: string, key: string, value1: string, value2: string, value3: string) {
        sendCommand("AT+CIPSTART=\"TCP\",\"maker.ifttt.com\",80")
        basic.pause(1000)
        let response = "";
        while (true) {
            response = response + serial.readString();
            if (response.includes("OK") || response.includes("CONNECT") || response.includes("ERROR")) {
                break
            }
        }
        if (response.includes("CONNECT")) {
            let request = "GET https://maker.ifttt.com/trigger/" + eventname + "/with/key/" + key + "?value1=" + value1 + "&value2=" + value2 + "&value3=" + value3
            let strsize = request.length + 2;
            if (strsize < 200) {
                sendCommand("AT+CIPSEND=" + strsize)
                basic.pause(500)
                response = response + serial.readString();
                sendCommand(request)
                basic.pause(1000)
                response = "";
                while (true) {
                    response = response + serial.readString();
                    if (response.includes("OK") || response.includes("SEND") || response.includes("ERROR")) {
                        break
                    }
                }
            }
        }
    }
}