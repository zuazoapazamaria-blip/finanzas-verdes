import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Types "../types/transactions";

module {
  public type Transaction = Types.Transaction;
  public type TransactionId = Types.TransactionId;
  public type TransactionKind = Types.TransactionKind;
  public type Category = Types.Category;
  public type Summary = Types.Summary;
  public type CategoryTotal = Types.CategoryTotal;

  public func create(
    transactions : Map.Map<TransactionId, Transaction>,
    nextId : { var nextId : Nat },
    _caller : Principal,
    kind : TransactionKind,
    amount : Nat,
    category : Category,
    date : Types.Timestamp,
  ) : Transaction {
    let id = nextId.nextId;
    nextId.nextId := id + 1;
    let transaction : Transaction = {
      id;
      kind;
      amount;
      category;
      date;
      createdAt = Time.now().toNat();
    };
    transactions.add(id, transaction);
    transaction;
  };

  public func list(
    transactions : Map.Map<TransactionId, Transaction>,
    caller : Principal,
  ) : [Transaction] {
    ignore caller;
    let all = transactions.values().toArray();
    all.sort(func(a, b) {
      if (a.date > b.date) { #less }
      else if (a.date < b.date) { #greater }
      else if (a.id > b.id) { #less }
      else if (a.id < b.id) { #greater }
      else { #equal };
    });
  };

  public func delete(
    transactions : Map.Map<TransactionId, Transaction>,
    caller : Principal,
    id : TransactionId,
  ) : Bool {
    ignore caller;
    switch (transactions.get(id)) {
      case (?_) {
        transactions.remove(id);
        true;
      };
      case null { false };
    };
  };

  public func summary(
    transactions : Map.Map<TransactionId, Transaction>,
    caller : Principal,
  ) : Summary {
    ignore caller;
    var totalIncome = 0;
    var totalExpense = 0;
    var comida = 0;
    var transporte = 0;
    var entretenimiento = 0;
    for (t in transactions.values()) {
      switch (t.kind) {
        case (#income) { totalIncome += t.amount };
        case (#expense) {
          totalExpense += t.amount;
          switch (t.category) {
            case (#comida) { comida += t.amount };
            case (#transporte) { transporte += t.amount };
            case (#entretenimiento) { entretenimiento += t.amount };
          };
        };
      };
    };
    {
      totalIncome;
      totalExpense;
      balance = totalIncome.toInt() - totalExpense.toInt();
      byCategory = [
        { category = #comida; total = comida },
        { category = #transporte; total = transporte },
        { category = #entretenimiento; total = entretenimiento },
      ];
    };
  };
};
