import Map "mo:core/Map";
import Types "../types/transactions";
import TransactionsLib "../lib/transactions";

mixin (
  transactions : Map.Map<Types.TransactionId, Types.Transaction>,
  nextId : { var nextId : Nat },
) {
  public shared ({ caller }) func createTransaction(
    kind : Types.TransactionKind,
    amount : Nat,
    category : Types.Category,
    date : Types.Timestamp,
  ) : async Types.Transaction {
    TransactionsLib.create(transactions, nextId, caller, kind, amount, category, date);
  };

  public query ({ caller }) func listTransactions() : async [Types.Transaction] {
    TransactionsLib.list(transactions, caller);
  };

  public shared ({ caller }) func deleteTransaction(id : Types.TransactionId) : async Bool {
    TransactionsLib.delete(transactions, caller, id);
  };

  public query ({ caller }) func getSummary() : async Types.Summary {
    TransactionsLib.summary(transactions, caller);
  };
};
