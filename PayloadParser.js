function parseUplink(device, payload) {

    var payloadb = payload.asBytes();
    var decoded = Decoder(payloadb, payload.port)
    env.log(decoded);

    // Store People Counter
    if (decoded.line_1_total_in != null) {
        var sensor1 = device.endpoints.byAddress("1");

        if (sensor1 != null)
            sensor1.updateGenericSensorStatus(decoded.line_1_total_in);

    };
    
    // Store People Counter
    if (decoded.line_1_total_out != null) {
        var sensor1 = device.endpoints.byAddress("2");

        if (sensor1 != null)
            sensor1.updateGenericSensorStatus(decoded.line_1_total_out);

    };

    // Store People Counter
    if (decoded.line_2_total_in != null) {
        var sensor1 = device.endpoints.byAddress("3");

        if (sensor1 != null)
            sensor1.updateGenericSensorStatus(decoded.line_2_total_in);

    };

    // Store People Counter
    if (decoded.line_2_total_out != null) {
        var sensor1 = device.endpoints.byAddress("4");

        if (sensor1 != null)
            sensor1.updateGenericSensorStatus(decoded.line_2_total_out);

    };

    // Store People Counter
    if (decoded.line_3_total_in != null) {
        var sensor1 = device.endpoints.byAddress("5");

        if (sensor1 != null)
            sensor1.updateGenericSensorStatus(decoded.line_3_total_in);

    };

    // Store People Counter
    if (decoded.line_3_total_out != null) {
        var sensor1 = device.endpoints.byAddress("6");

        if (sensor1 != null)
            sensor1.updateGenericSensorStatus(decoded.line_3_total_out);

    };

    // Store People Counter
    if (decoded.line_4_total_in != null) {
        var sensor1 = device.endpoints.byAddress("7");

        if (sensor1 != null)
            sensor1.updateGenericSensorStatus(decoded.line_4_total_in);

    };

    // Store People Counter
    if (decoded.line_4_total_out != null) {
        var sensor1 = device.endpoints.byAddress("8");

        if (sensor1 != null)
            sensor1.updateGenericSensorStatus(decoded.line_4_total_out);

    };

}

function buildDownlink(device, endpoint, command, payload) 
{ 
	// This function allows you to convert a command from the platform 
	// into a payload to be sent to the device.
	// Learn more at https://wiki.cloud.studio/page/200

	// The parameters in this function are:
	// - device: object representing the device to which the command will
	//   be sent. 
	// - endpoint: endpoint object representing the endpoint to which the 
	//   command will be sent. May be null if the command is to be sent to 
	//   the device, and not to an individual endpoint within the device.
	// - command: object containing the command that needs to be sent. More
	//   information at https://wiki.cloud.studio/page/1195.

	// This example is written assuming a device that contains a single endpoint, 
	// of type appliance, that can be turned on, off, and toggled. 
	// It is assumed that a single byte must be sent in the payload, 
	// which indicates the type of operation.

/*
	 payload.port = 25; 	 	 // This device receives commands on LoRaWAN port 25 
	 payload.buildResult = downlinkBuildResult.ok; 

	 switch (command.type) { 
	 	 case commandType.onOff: 
	 	 	 switch (command.onOff.type) { 
	 	 	 	 case onOffCommandType.turnOn: 
	 	 	 	 	 payload.setAsBytes([30]); 	 	 // Command ID 30 is "turn on" 
	 	 	 	 	 break; 
	 	 	 	 case onOffCommandType.turnOff: 
	 	 	 	 	 payload.setAsBytes([31]); 	 	 // Command ID 31 is "turn off" 
	 	 	 	 	 break; 
	 	 	 	 case onOffCommandType.toggle: 
	 	 	 	 	 payload.setAsBytes([32]); 	 	 // Command ID 32 is "toggle" 
	 	 	 	 	 break; 
	 	 	 	 default: 
	 	 	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 	 	 break; 
	 	 	 } 
	 	 	 break; 
	 	 default: 
	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 break; 
	 }
*/

}

/**
 * Payload Decoder for The Things Network
 *
 * Copyright 2023 Milesight IoT
 *
 * @product VS133
 */
function Decoder(bytes, port) {
    return milesight(bytes);
}

total_in_chns = [0x03, 0x06, 0x09, 0x0c];
total_out_chns = [0x04, 0x07, 0x0a, 0x0d];
period_chns = [0x05, 0x08, 0x0b, 0x0e];

function milesight(bytes) {
    var decoded = {};

    for (var i = 0; i < bytes.length; ) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // LINE TOTAL IN
        if (includes(total_in_chns, channel_id) && channel_type === 0xd2) {
            var channel_in_name = "line_" + ((channel_id - total_in_chns[0]) / 3 + 1);
            decoded[channel_in_name + "_total_in"] = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // LINE TOTAL OUT
        else if (includes(total_out_chns, channel_id) && channel_type === 0xd2) {
            var channel_out_name = "line_" + ((channel_id - total_out_chns[0]) / 3 + 1);
            decoded[channel_out_name + "_total_out"] = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // LINE PERIOD
        else if (includes(period_chns, channel_id) && channel_type === 0xcc) {
            var channel_period_name = "line_" + ((channel_id - period_chns[0]) / 3 + 1);
            decoded[channel_period_name + "_period_in"] = readUInt16LE(bytes.slice(i, i + 2));
            decoded[channel_period_name + "_period_out"] = readUInt16LE(bytes.slice(i + 2, i + 4));
            i += 4;
        }
        // REGION COUNT
        else if (channel_id === 0x0f && channel_type === 0xe3) {
            decoded.region_1_count = readUInt8(bytes[i]);
            decoded.region_2_count = readUInt8(bytes[i + 1]);
            decoded.region_3_count = readUInt8(bytes[i + 2]);
            decoded.region_4_count = readUInt8(bytes[i + 3]);
            i += 4;
        }
        // REGION DWELL TIME
        else if (channel_id === 0x10 && channel_type === 0xe4) {
            var dwell_channel_name = "region_" + bytes[i];
            decoded[dwell_channel_name + "_avg_dwell"] = readUInt16LE(bytes.slice(i + 1, i + 3));
            decoded[dwell_channel_name + "_max_dwell"] = readUInt16LE(bytes.slice(i + 3, i + 5));
            i += 5;
        } else {
            break;
        }
    }

    return decoded;
}

function readUInt8(bytes) {
    return bytes & 0xff;
}

function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readUInt32LE(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return (value & 0xffffffff) >>> 0;
}

function includes(datas, value) {
    var size = datas.length;
    for (var i = 0; i < size; i++) {
        if (datas[i] == value) {
            return true;
        }
    }
    return false;
}
