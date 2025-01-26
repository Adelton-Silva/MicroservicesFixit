using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Counter
{
    [BsonId]
    public ObjectId Id { get; set; }  // ID único para o contador

    [BsonElement("sequence_value")]  // Valor do contador
    public int SequenceValue { get; set; }
}
