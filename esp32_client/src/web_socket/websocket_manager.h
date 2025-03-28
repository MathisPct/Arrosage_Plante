#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <sensor/air_sensor.h>
#include <sensor/soil_moisture_sensor.h>
#include <sensor/water_level_sensor.h>
#include <actuator/pump.h>

class WebSocketManager
{
private:
    WebSocketsClient webSocketClient;
    AirSensor& airSensor;
    SoilMoistureSensor& soilMoistureSensor;
    WaterLevelSensor& waterLevelSensor;
    Pump& pump;
    void onMessageReceived(WStype_t type, uint8_t* payload, size_t length);
    bool preSyncToServer();
    void reSyncToServer();

    String plantId = "";
    bool isAssociatedToPlant = false;
public:
    WebSocketManager(AirSensor& airSensor, SoilMoistureSensor& soilMoistureSensor, WaterLevelSensor& waterLevelSensor, Pump& pump);

    void begin(const char* host, uint16_t port, const char* endpoint, String macAdress);
    void loop();
    void handleArroser(float humidityTarget, float soilWaterRetentionFactor);
    void sendPeriodicSensorData();
};