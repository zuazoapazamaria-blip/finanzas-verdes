import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Map "mo:core/Map";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import Types "types/transactions";
import TransactionsMixin "mixins/transactions-api";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;
  let transactions : Map.Map<Types.TransactionId, Types.Transaction>;
  let transactionState : { var nextId : Nat };

  include MixinAuthorization(accessControlState, null);
  include TransactionsMixin(transactions, transactionState);
  include ApiDocMixin();

  include Expose({
    entities = [
      transactions.toEntityManual("transaction", "Transaction", "id")
        .payload("id", func t = t.id)
        .payload("kind", func t = Types.kindToText(t.kind))
        .payload("amount", func t = t.amount)
        .payload("category", func t = Types.categoryToText(t.category))
        .payload("date", func t = t.date)
        .payload("createdAt", func t = t.createdAt)
        .sample({
          id = 0;
          kind = #expense;
          amount = 0;
          category = #comida;
          date = 0;
          createdAt = 0;
        })
        .controllerOnly()
        .build(),
    ];
  });
};
