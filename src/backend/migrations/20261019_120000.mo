import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";

module {
  type TransactionId = Nat;
  type TransactionKind = { #income; #expense };
  type Category = { #comida; #transporte; #entretenimiento };
  type Transaction = {
    id : TransactionId;
    kind : TransactionKind;
    amount : Nat;
    category : Category;
    date : Nat;
    createdAt : Nat;
  };

  public type OldActor = {};

  public type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    transactions : Map.Map<TransactionId, Transaction>;
    transactionState : { var nextId : Nat };
  };

  public func migration(_ : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      transactions = Map.empty();
      transactionState = { var nextId = 0 };
    };
  };
};
