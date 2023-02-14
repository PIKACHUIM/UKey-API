import sys
import chilkat2

zip = chilkat2.Zip()

#  Any string unlocks the component for the 1st 30-days.
success = zip.UnlockComponent("Anything for 30-day trial")
if (success != True):
    print(zip.LastErrorText)
    sys.exit()

success = zip.NewZip("test.zip")
if (success != True):
    print(zip.LastErrorText)
    sys.exit()

recurse = False
zip.AppendFiles("*.txt",recurse)

success = zip.WriteZipAndClose()
if (success != True):
    print(zip.LastErrorText)
    sys.exit()

print("Created test.zip")
