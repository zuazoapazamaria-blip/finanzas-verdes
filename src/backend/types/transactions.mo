module {
  public type Timestamp = Nat;

  public type TransactionId = Nat;

  public type TransactionKind = {
    #income;
    #expense;
  };

  public type Category = {
    #comida;
    #transporte;
    #entretenimiento;
  };

  public type Transaction = {
    id : TransactionId;
    kind : TransactionKind;
    amount : Nat;
    category : Category;
    date : Timestamp;
    createdAt : Timestamp;
  };

  public type CategoryTotal = {
    category : Category;
    total : Nat;
  };

  public type Summary = {
    totalIncome : Nat;
    totalExpense : Nat;
    balance : Int;
    byCategory : [CategoryTotal];
  };

  public func kindToText(kind : TransactionKind) : Text {
    switch (kind) {
      case (#income) { "income" };
      case (#expense) { "expense" };
    };
  };

  public func categoryToText(category : Category) : Text {
    switch (category) {
      case (#comida) { "comida" };
      case (#transporte) { "transporte" };
      case (#entretenimiento) { "entretenimiento" };
    };
  };
};
