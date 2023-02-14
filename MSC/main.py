from chilkat2 import chilkat2

# scard = chilkat2.SCard()
# readers_list = chilkat2.StringTable()
# scard.ListReaders(readers_list)
# print(readers_list.Count)
# for i in range(0, readers_list.Count):
#     print(readers_list.GetStrings(i, 1, True))
cardDriver = chilkat2.ScMinidriver()
lst = cardDriver.AcquireContext("TEST")

print(lst)
